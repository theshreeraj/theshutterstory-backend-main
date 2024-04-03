import Booking from "../models/BookingSchema.js";
import Photographer from "../models/PhotographerSchema.js";

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
