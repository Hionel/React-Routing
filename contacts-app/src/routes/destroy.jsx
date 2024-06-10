import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
	const id = params.contactId;
	await deleteContact(id);
	return redirect("/");
}
