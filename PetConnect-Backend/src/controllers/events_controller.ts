import createController from "./base_controller";
import Event, { IEvent } from "../models/event_model";
const populateOptions = { path: 'owner', select: 'email' }

const eventsController = createController<IEvent>(Event, populateOptions);

export default eventsController;