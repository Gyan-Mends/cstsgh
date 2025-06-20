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
    const method = request.method;

    switch (method) {
      case "POST": {
        const body = await request.json();

        const trainingTypeData = {
          name: body.name,
          description: body.description,
          image: body.image, // Base64 string
          isActive: body.isActive,
        };

        const newTrainingType = new TrainingType(trainingTypeData);
        await newTrainingType.save();
        
        return Response.json({ success: true, message: "Training type created successfully", data: newTrainingType });
      }

      case "PUT": {
        const body = await request.json();
        const id = body.id;

        const updateData: any = {
          name: body.name,
          description: body.description,
          isActive: body.isActive,
        };

        // Only update image if provided
        if (body.image) {
          updateData.image = body.image;
        }

        const updatedTrainingType = await TrainingType.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedTrainingType) {
          return Response.json({ success: false, message: "Training type not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Training type updated successfully", data: updatedTrainingType });
      }

      case "DELETE": {
        const body = await request.json();
        const id = body.id;
        
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