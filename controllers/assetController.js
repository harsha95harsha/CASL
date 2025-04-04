
const {defineAbilitiesFor} = require('../abilities/defineAbilities');
const db = require('../config/db');


async function createAsset(req, res) {
  try {
    const ability = await defineAbilitiesFor(req.user);

    if (!ability.can('create', 'Asset')) {
      return res.status(403).json({
        message: 'You do not have permission to create an Asset.',
      });
    }

    const { asset_name} = req.body;
    const user_sno = req.user.user_sno;
    const role = req.user.role;
    const asset = await db.Asset.create({ asset_name, user:user_sno,role });
    res.status(201).json({
      message: 'Asset has been created successfully',
      asset: asset,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to create Asset',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
  }
}

async function getAssets(req, res) {
  try {
    const assets = await db.Asset.findAll();
 

    // Define abilities with dynamic subjects
    const ability = await defineAbilitiesFor(req.user);
    

    if (!ability.can('read', 'Asset')) {
      return res.status(403).json({
        message: "You do not have permission to view assets.",
      });
    }
    
    res.json({
      message: "Assets retrieved successfully",
      assets:assets,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to retrive Assets',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
    
  }
}

async function updateAsset(req, res) {
  try {
    const asset_sno = req.params.id;
    const asset = await db.Asset.findByPk(abilitysset_sno);

    if (!abilitysset) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Asset not found" });
    }

    const ability = await defineAbilitiesFor(req.user);
 
  
    const user = req.user.user_sno;
    
    console.log('The creator of the Asset is: ', user);
    console.log('The Asset_sno of the fetched Asset to be updated is: ',asset_sno);


    if (!ability.can('update', asset)) {
      return res.status(403).json({
        message: 'You do not have permission to update this Asset.',
      });
    }

    const {  } = req.body;

    // Proceed with update if permission is granted
    const updatedAsset = await asset.update({
    
    });
    return res.json({
      message: 'Asset updated successfully',
      updatedAsset: updatedAsset,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update Asset',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

async function deleteAsset(req, res) {
  try {
    const asset_sno = req.params.id;
    const asset = await db.Asset.findByPk(asset_sno);

    if (!asset) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Asset not found" });
    }

    // Define abilities based on the current user
    const ability = await defineAbilitiesFor(req.user);

    // Check if user has permission to delete this article
    if (!ability.can('delete', asset)) {
      return res.status(403).json({
        message: 'You do not have permission to delete this Asset.',
      });
    }

    // Proceed with deletion if permission is granted
    await asset.destroy();
    return res.json({
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete Asset',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

module.exports = { createAsset, getAssets, updateAsset,deleteAsset };
