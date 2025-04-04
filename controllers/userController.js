
const argon2 = require('argon2');
const {defineAbilitiesFor} = require('../abilities/defineAbilities');

const db = require('../config/db');


async function createUser(req, res) {
  try {

    const ability = await defineAbilitiesFor(req.user);

    if (!ability.can('create', 'User')) {
      return res.status(403).json({
        message: 'You do not have permission to create a User.',
      });
    }


    const {name, email, password,role} = req.body;

    const hashedPassword = await argon2.hash(password);

    const user = await db.User.create({
      name:name,
      email:email,
      password:hashedPassword,
      role:role
    });
    res.status(201).json({
      message:'User has been created successfully',
      user:user
    });
  } catch (error){
     console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to create user',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
}
// try {
//   const transaction = await db.sequelize.transaction();

//   try {
//     const { name, email, password, role, permissions } = req.body;

//     // Hash the password
//     const hashedPassword = await argon2.hash(password);

//     // Create the user
//     const user = await db.User.create(
//       { name, email, password: hashedPassword, role },
//       { transaction }
//     );

//     // Insert permissions only for non-admin users
//     if (role !== 'admin' && permissions) {
//       const permissionRecords = permissions.map((p) => ({
//         user_sno: user.user_sno,
//         action: p.action,
//         subject: p.subject,
//       }));

//       // Bulk create permissions
//       await db.Permissions.bulkCreate(permissionRecords, { transaction });
//     }

//     // Commit the transaction
//     await transaction.commit();

//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         user_sno: user.user_sno,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     // Roll back the transaction on error
//     await transaction.rollback();
//     throw error;
//   }
// } catch (error) {
//   console.error('Error creating user:', error);

//   if (error.name === 'SequelizeUniqueConstraintError') {
//     res.status(400).json({
//       message: 'Failed to create user',
//       error: 'Validation error',
//       details: error.errors.map((err) => ({
//         message: err.message,
//         type: err.type,
//         path: err.path,
//         value: err.value,
//         origin: err.origin,
//       })),
//     });
//   } else {
//     res.status(500).json({
//       message: 'Error creating user',
//       error: error.message,
//     });
//   }
}




async function getAllUsers(req,res) {
  try{
    const users = await db.User.findAll();
    const ability = await defineAbilitiesFor(req.user);
    

    if (!ability.can('read', 'User')) {
      return res.status(403).json({
        message: "You do not have permission to view users.",
      });
    }
    
    res.json({
      message: "Users retrieved successfully",
      users,
    });

  }catch (error){
    console.log(error); // This helps log the full error object in the console
    res.status(500).json({
    message: 'Failed to retrive Users',
    error: error.message || 'An unknown error occurred',
    details: error.errors || {},
});
  }
}


// async function updateUser(req,res) {
//   try{

//     const user_sno = req.params.id;
//     const user = await db.User.findByPk(user_sno);
//     console.log('The user to be updated is: ', user);

//     if (!user) {
//       return res.status(404).json({
//         success:false,
//         statusCode:404,
//         message:"User does not exist"
//       })
//     }

//     const ability = await defineAbilitiesFor(req.user);

//     if (!ability.can('update', user)) {
//       return res.status(403).json({
//         message: 'You do not have permission to update this user.',
//       });
//     }

//     const updatedUser = await user.update(req.body);
//     console.log('The updated user is: ', updatedUser);
  
//     return res.status(200).json({
//       message: 'User has been updated successfully',
//       user: updatedUser
//     });
//   } catch(error) {
//     res.status(500).json({
//       message: 'Failed to update user',
//       error: error.message || 'An unknown error occurred',
//       details: error.errors || {},
//     });
//   }
// }
async function updateUser(req, res) {
  
    const transaction = await db.sequelize.transaction(); // Start a transaction
    try {
     
      const user_sno = req.params.id;
      const { name, email } = req.body;
    const user = await db.User.findByPk(user_sno);
    console.log('The user to be updated is: ', user);

    if (!user) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message:"User does not exist"
      })
    }

    const ability = await defineAbilitiesFor(req.user);

    if (!ability.can('update', user)) {
      return res.status(403).json({
        message: 'You do not have permission to update this user.',
      });
    }
  
      // Update the user's details
     const updatedUser =  await user.update({ name,email });
  
      
      // Commit the transaction
      await transaction.commit();
  
      res.status(200).json({ message: 'User updated successfully', updatedUser:updatedUser });
    } catch (err) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      res.status(500).json({ message: 'Error updating user', error: err.message });
    }
  }
  

  async function updatePermissions(req, res) {
    const transaction = await db.sequelize.transaction(); // Start a transaction
    try {
      const user_sno = req.params.id; // Extract user_sno from the route parameter
      const { permissions } = req.body;
  
      // Ensure permissions are provided and are in the correct format
      if (!permissions || !Array.isArray(permissions)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Invalid permissions data',
        });
      }
  
      // Find the user by primary key
      const user = await db.User.findByPk(user_sno);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "User does not exist",
        });
      }
  
      // Define abilities for the logged-in user
      const ability = await defineAbilitiesFor(req.user);
  
      // Check if the logged-in user has the ability to update permissions
      if (!ability.can('update', 'Permission')) {
        return res.status(403).json({
          message: 'You do not have permission to update user permissions.',
        });
      }
  
      // Delete existing permissions for the user
      await db.Permissions.destroy({ where: { user_sno }, transaction });
  
      // Prepare the new permissions for bulk insertion
      const permissionRecords = permissions.map((p) => ({
        user_sno,
        action: p.action,
        subject: p.subject,
      }));
  
      // Bulk insert new permissions
      await db.Permissions.bulkCreate(permissionRecords, { transaction });
  
      // Commit the transaction
      await transaction.commit();
  
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Permissions updated successfully',
      });
    } catch (err) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      res.status(500).json({ message: 'Error updating permissions', error: err.message });
    }
  }
  

async function deleteUser(req,res) {
  try {
    const user_sno = req.params.id;
    const user = await db.User.findByPk(user_sno);

    if(!user) {
      return res.status(404).json({message:"User not found"});
    }

    const ability = await defineAbilitiesFor(req.user);

    if(!ability.can('delete', user)) {
      return res.status(403).json({
        message:'You do not have permission to delete this user.'
      })
    }
    await user.destroy({ where: { user_sno } });
    // await db.Permissions.destroy({ where: { user_sno } });
    return res.json({
      message:"User deleted successfully"
    })
  } catch (error) {
    res.status(500).json({message:"Failed to update the user", error})
  }
}

module.exports = {createUser, getAllUsers,updateUser,updatePermissions,deleteUser};