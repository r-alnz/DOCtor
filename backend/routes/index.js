var express = require('express');
var router = express.Router();
var userModel = require("../models/useModel")
var bcrypt = require('bcryptjs'); // For hashing passwords
var jwt = require('jsonwebtoken'); // For generating tokens
var docModel = require("../models/docModel");

const secret = "secret"; // Secret key for signing JWT tokens

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Route for user signup
router.post("/signup", async (req, res) => {
  let {username, name, email, phone, password} = req.body;
  let emailCon = await userModel.findOne({email: email});
  let phoneCon = await userModel.findOne({phone: phone});
  
  // Check if email or phone number already exists
  if (emailCon) {
    return res.json({ success: false, message: "email already exist" });
  } else if (phoneCon) {
    return res.json({ success: false, message: "Phone number already exist" });
  } else {
    // Hash the password before saving the user
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, async function(err, hash) {
        if (err) throw err;
        let user = await userModel.create({
          username: username,
          name: name,
          email: email,
          phone: phone,
          password: hash
        });
        res.json({ success: true, message: "User created successfully", userId: user._id });
      });
    });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  let {email, password} = req.body;
  let user = await userModel.findOne({email: email});
  
  // If user is found, verify the password
  if (user) {
    bcrypt.compare(password, user.password, function(err, result) {
      if (result) {
        var token = jwt.sign({ email: user.email, userId: user._id }, secret);
        res.json({ success: true, message: "Login successful", userId: user._id, token: token });
      } else {
        res.json({ success: false, message: "Invalid password" });
      }
    });
  } else {
    res.json({ success: false, message: "Invalid email" });
  }
});

// Route for creating a new document
router.post("/createDoc", async (req, res) => {
  const { userId, docName, docType, pageSize } = req.body;

  // Verify if the user exists before creating a document
  const user = await userModel.findById(userId);
  if (user) {
    try {
      const doc = await docModel.create({
        uploadedBy: userId,
        title: docName,
        docType: docType,
        pageSize: pageSize
      });
      return res.json({ success: true, message: "Document created successfully", docId: doc._id });
    } catch (error) {
      console.error("Error creating document:", error);
      return res.json({ success: false, message: "Failed to create document" });
    }
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

// Route for uploading document content
router.post("/uploadDoc", async (req, res) => {
  let {userId, docId, content} = req.body;
  let user = userModel.findById(userId);
  
  // Update document content if user is valid
  if (user) {
    let doc = await docModel.findByIdAndUpdate(docId, { content: content });
    return res.json({ success: true, message: "Document uploaded successfully" });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

// Route to retrieve a specific document
router.post("/getDoc", async (req, res) => {
  let {docId, userId} = req.body;
  let user = await userModel.findById(userId);
  
  // Fetch document if user is valid
  if (user) {
    let doc = await docModel.findById(docId);
    if (doc) {
      return res.json({ success: true, message: "Document fetched successfully", doc: doc });
    } else {
      return res.json({ success: false, message: "Invalid document" });
    }
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

// Route to delete a document
router.post("/deleteDoc", async (req, res) => {
  let {userId, docId} = req.body;
  let user = await userModel.findById(userId);
  
  // Delete document if user is valid
  if (user) {
    let doc = await docModel.findByIdAndDelete(docId);
    return res.json({ success: true, message: "Document deleted successfully" });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

// Route to get all documents uploaded by a user
router.post("/getAllDocs", async (req, res) => {
  let {userId} = req.body;
  let user = await userModel.findById(userId);
  
  // Fetch documents if user is valid
  if (user) {
    let docs = await docModel.find({ uploadedBy: userId });
    return res.json({ success: true, message: "Documents fetched successfully", docs: docs });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

// Route to retrieve user information
router.post("/getUser", async (req, res) => {
  let {userId} = req.body;
  let user = await userModel.findById(userId);
  
  // Return user info if valid user
  if (user) {
    return res.json({ success: true, message: "User fetched successfully", user: user });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

// Route for user logout
router.post("/logout", async (req, res) => {
  let {userId} = req.body;
  let user = await userModel.findById(userId);
  
  // Process logout if user is valid
  if (user) {
    return res.json({ success: true, message: "User logged out successfully" });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

// Route to retrieve a PDF template based on document type and style
router.post('/getTemplatePdf', (req, res) => {
  const { docType, templateStyle } = req.body;

  // Define URLs for PDF templates based on docType and templateStyle
  const pdfUrls = {
    resume: {
      basic: '/templates/resume_basic.pdf',
      modern: '/templates/resume_modern.pdf',
    },
    resignation: {
      basic: '/templates/resignation_basic.pdf',
      modern: '/templates/resignation_modern.pdf',
    },
  };

  // Send appropriate PDF URL if found, otherwise return an error message
  const pdfUrl = pdfUrls[docType]?.[templateStyle];
  if (pdfUrl) {
    res.json({ success: true, pdfUrl });
  } else {
    res.json({ success: false, message: "Template not found" });
  }
});

module.exports = router; // Export the router for use in main application file
