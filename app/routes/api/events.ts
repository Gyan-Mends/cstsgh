import { type ActionFunction, type LoaderFunction } from "react-router";
import Event from "~/model/events";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const event = await Event.findById(id);
      if (!event) {
        return Response.json({ success: false, message: "Event not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: event });
    }

    const events = await Event.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: events });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch events" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const method = request.method;
    
    switch (method) {
      case "POST": {
        const body = await request.json();
        const eventData = {
          title: body.title,
          description: body.description,
          date: body.date,
          duration: body.duration,
          location: body.location,
          image: body.image,
        };

        const newEvent = new Event(eventData);
        await newEvent.save();
        
        return Response.json({ success: true, message: "Event created successfully", data: newEvent });
      }

      case "PUT": {
        const body = await request.json();
        const id = body.id;
        const updateData = {
          title: body.title,
          description: body.description,
          date: body.date,
          duration: body.duration,
          location: body.location,
          ...(body.image && { image: body.image }),
        };

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedEvent) {
          return Response.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Event updated successfully", data: updatedEvent });
      }

      case "DELETE": {
        const body = await request.json();
        const id = body.id;
        const deletedEvent = await Event.findByIdAndDelete(id);
        
        if (!deletedEvent) {
          return Response.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Event deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 