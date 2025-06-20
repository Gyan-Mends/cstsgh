import { type ActionFunction, type LoaderFunction } from "react-router";
import Training from "~/model/training";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const training = await Training.findById(id).populate("trainingTypeId");
      if (!training) {
        return Response.json({ success: false, message: "Training not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: training });
    }

    const trainings = await Training.find().populate("trainingTypeId").sort({ createdAt: -1 });
    return Response.json({ success: true, data: trainings });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch trainings" }, { status: 500 });
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

        const trainingData = {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          date: formData.get("date") as string,
          duration: formData.get("duration") as string,
          format: formData.get("format") as string,
          client: formData.get("client") as string,
          image: imageUrl,
          trainingTypeId: formData.get("trainingTypeId") as string,
        };

        const newTraining = new Training(trainingData);
        await newTraining.save();
        
        return Response.json({ success: true, message: "Training created successfully", data: newTraining });
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
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          date: formData.get("date") as string,
          duration: formData.get("duration") as string,
          format: formData.get("format") as string,
          client: formData.get("client") as string,
          trainingTypeId: formData.get("trainingTypeId") as string,
        };

        // Only update image if a new file was provided
        if (imageUrl) {
          updateData.image = imageUrl;
        }

        const updatedTraining = await Training.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedTraining) {
          return Response.json({ success: false, message: "Training not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Training updated successfully", data: updatedTraining });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedTraining = await Training.findByIdAndDelete(id);
        
        if (!deletedTraining) {
          return Response.json({ success: false, message: "Training not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Training deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 