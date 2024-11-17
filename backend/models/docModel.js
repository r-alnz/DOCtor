const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/docbuilder");

// Define the Document Schema
const docSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  uploadedBy: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  docType: {          // New field for document type
    type: String,
    required: true
  },
  pageSize: {         // New field for page size
    type: String,
    required: true
  },
  template: {         // New field for storing template content
    type: String,
    default: ""
  }
});

// Pre-save middleware to set default template content based on docType if content is empty
docSchema.pre('save', function (next) {
  if (!this.content) {
    switch (this.docType) {
      case 'resume':
        this.template = 'Basic Resume Template...';
        this.content = this.template;
        break;
      case 'resignation':
        this.template = 'Formal Resignation Letter Template...';
        this.content = this.template;
        break;
      // Add more cases as needed
      default:
        this.template = 'Generic Document Template...';
        this.content = this.template;
    }
  }
  next();
});

module.exports = mongoose.model('Document', docSchema);
