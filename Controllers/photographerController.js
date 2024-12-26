import Booking from "../models/BookingSchema.js";
import Photographer from "../models/PhotographerSchema.js";
import cloudinary from "../config/cloudinary.js";


// Update photographer
export const updatePhotographer = async (req, res) => {
  const id = req.params.id;

  try {
    const updatePhotographer = await Photographer.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: updatePhotographer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to Updated" });
  }
};

// Delete photographer
export const deletePhotographer = async (req, res) => {
  const id = req.params.id;

  try {
    await Photographer.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to Delete" });
  }
};

// Get single photographer by Id
export const getSinglePhotographer = async (req, res) => {
  const id = req.params.id;

  try {
    const photographer = await Photographer.findByIdAndUpdate(id)
      .populate("reviews")
      .select("-password");
    res
      .status(200)
      .json({
        success: true,
        message: "Photographer Found",
        data: photographer,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Not found" });
  }
};

// Find all photographers
export const getAllPhotographer = async (req, res) => {
  try {
    const { query } = req.query;
    let photographers;

    if (query) {
      photographers = await Photographer.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      photographers = await Photographer.find({
        isApproved: "approved",
      }).select("-password");
    }
    res.status(200).json({
      success: true,
      message: "Photographers Found",
      data: photographers,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No Photographer found" });
  }
};

export const getPhotographerProfile = async (req, res) => {
  const photographerId = req.userId;

  try {
    const photographer = await Photographer.findById(photographerId);

    if (!photographer) {
      return res
        .status(404)
        .json({ success: false, message: "Photographer not found" });
    }

    const { password, ...rest } = photographer._phg;
    const appointments = await Booking.find({ photographerId: photographerId });

    res.status(200).json({
      success: true,
      message: "Profile found",
      data: { ...rest, appointments },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};


export const uploadWork = async (req, res) => {
  try {
    // Check if the file is present
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload file to Cloudinary using the path from multer
    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    console.log(uploadResult);

    // You can save the URL or any other details you need in your database
    const photoUrl = uploadResult.secure_url;

    console.log(req.userId , photoUrl)

    // Update the photographer's profile with the uploaded photo URL
    const photographer = await Photographer.findByIdAndUpdate(
      req.userId,  // Assuming the photographer is authenticated
      { $push: { work: photoUrl } },  // Update the 'work' field or any other field
      { new: true,userFindAndModify : false }
    );

    res.status(201).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: photographer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error in uploading photo',
      error: err.message
    });
  }
};