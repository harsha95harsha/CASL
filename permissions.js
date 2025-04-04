const { Article , User} = require("./config/db");

// permissions.js
module.exports = {
  admin: {
    manage: ['all'], // Full permissions for admin
  },
  default: {
    create: {Article:true, User:false}, // Non-admins can create only articles
    read: { Article: true, User: true }, // Non-admins can read all subjects
    update: { // Only update their own resources
      Article: { author_id: 'user_sno' },
      User: { user_sno: 'user_sno' },
    },
    delete: { // Only delete their own resources
      Article: { author_id: 'user_sno' },
      // User: { author_id: 'user_sno' },
    },
    restrictedActions: { // Define any restrictions explicitly here
      create: ['User'], // Cannot create users
      delete: ['User'], // Cannot delete users
     
  },
}
}



