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
    const method = request.method;

    switch (method) {
      case "POST": {
        const body = await request.json();
        
        const trainingData = {
          title: body.title,
          description: body.description,
          date: body.date,
          duration: body.duration,
          format: body.format,
          client: body.client,
          image: body.image, // Base64 string
          trainingTypeId: body.trainingTypeId,
        };

        const newTraining = new Training(trainingData);
        await newTraining.save();
        
        return Response.json({ success: true, message: "Training created successfully", data: newTraining });
      }

      case "PUT": {
        const body = await request.json();
        const id = body.id;

        const updateData: any = {
          title: body.title,
          description: body.description,
          date: body.date,
          duration: body.duration,
          format: body.format,
          client: body.client,
          trainingTypeId: body.trainingTypeId,
        };

        // Only update image if provided
        if (body.image) {
          updateData.image = body.image;
        }

        const updatedTraining = await Training.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedTraining) {
          return Response.json({ success: false, message: "Training not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Training updated successfully", data: updatedTraining });
      }

      case "DELETE": {
        const body = await request.json();
        const id = body.id;
        
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