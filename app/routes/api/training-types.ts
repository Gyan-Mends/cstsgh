import { type ActionFunction, type LoaderFunction } from "react-router";
import TrainingType from "~/model/trainingType";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const trainingType = await TrainingType.findById(id);
      if (!trainingType) {
        return Response.json({ success: false, message: "Training type not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: trainingType });
    }

    const trainingTypes = await TrainingType.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: trainingTypes });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch training types" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const method = request.method;
    const _method = formData.get("_method") as string;
    
    const actionMethod = _method || method;

    switch (actionMethod) {
      case "POST": {
        const imageFile = formData.get("image") as File | null;
        let imageUrl = "";
        
        // Handle file upload - for now, we'll just use a placeholder
        // In a real application, you'd upload to a file storage service
        if (imageFile && imageFile.size > 0) {
          // This is a placeholder - in production you'd upload to AWS S3, Cloudinary, etc.
          imageUrl = `/uploads/${Date.now()}-${imageFile.name}`;
          // TODO: Implement actual file upload logic
        }

        const trainingTypeData = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          image: imageUrl,
          isActive: formData.get("isActive") === "true",
        };

        const newTrainingType = new TrainingType(trainingTypeData);
        await newTrainingType.save();
        
        return Response.json({ success: true, message: "Training type created successfully", data: newTrainingType });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const imageFile = formData.get("image") as File | null;
        let imageUrl = "";
        
        // Handle file upload for updates
        if (imageFile && imageFile.size > 0) {
          // This is a placeholder - in production you'd upload to AWS S3, Cloudinary, etc.
          imageUrl = `/uploads/${Date.now()}-${imageFile.name}`;
          // TODO: Implement actual file upload logic
        }

        const updateData: any = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          isActive: formData.get("isActive") === "true",
        };

        // Only update image if a new file was provided
        if (imageUrl) {
          updateData.image = imageUrl;
        }

        const updatedTrainingType = await TrainingType.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedTrainingType) {
          return Response.json({ success: false, message: "Training type not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Training type updated successfully", data: updatedTrainingType });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedTrainingType = await TrainingType.findByIdAndDelete(id);
        
        if (!deletedTrainingType) {
          return Response.json({ success: false, message: "Training type not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Training type deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 