import {
	Outlet,
	useLoaderData,
	Form,
	redirect,
	NavLink,
	useNavigation,
	useSubmit,
} from "react-router-dom";
import { useEffect } from "react";
import { getContacts, createContact } from "../contacts";

export async function loader({ request }) {
	const url = new URL(request.url);
	const queryParam = url.searchParams.get("searchQueryParam");
	const contacts = await getContacts(queryParam);
	return { contacts, queryParam };
}

export async function action() {
	const contact = await createContact();
	return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
	const { contacts, queryParam } = useLoaderData();
	const navigation = useNavigation();
	const submit = useSubmit();

	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).get("searchQueryParam");

	useEffect(() => {
		document.getElementById("searchInput").value = queryParam;
	}, [queryParam]);

	return (
		<>
			<div id="sidebar">
				<h1>React Router Contacts</h1>
				<div>
					<Form id="search-form" role="search">
						<input
							id="searchInput"
							aria-label="Search contacts"
							placeholder="Search"
							type="search"
							name="searchQueryParam"
							defaultValue={queryParam}
							onChange={(event) => {
								const isFirstSearch = queryParam === null;
								submit(event.currentTarget.form, {
									replace: isFirstSearch,
								});
							}}
							className={searching ? "loading" : ""}
						/>
						<div id="search-spinner" aria-hidden hidden={!searching} />
						<div className="sr-only" aria-live="polite"></div>
					</Form>
					<Form method="post">
						<button type="submit">New</button>
					</Form>
				</div>
				<nav>
					{contacts.length ? (
						<ul>
							{contacts.map((contact) => (
								<li key={contact.id}>
									<NavLink
										to={`contacts/${contact.id}`}
										className={({ isActive, isPending }) =>
											isActive ? "active" : isPending ? "pending" : ""
										}
									>
										{contact.first || contact.last ? (
											<>
												{contact.first} {contact.last}
											</>
										) : (
											<i>No Name</i>
										)}{" "}
										{contact.favorite && <span>★</span>}
									</NavLink>
								</li>
							))}
						</ul>
					) : (
						<p>
							<i>No contacts</i>
						</p>
					)}
				</nav>
			</div>
			<div
				id="detail"
				className={navigation.state == "loading" ? "loading" : ""}
			>
				<Outlet />
			</div>
		</>
	);
}
