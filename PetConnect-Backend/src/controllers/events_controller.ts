import createController from "./base_controller";
import Event, { IEvent } from "../models/event_model";

const eventsController = createController<IEvent>(Event);

export default eventsController;