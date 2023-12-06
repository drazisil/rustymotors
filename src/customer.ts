interface CustomerRecord {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
}

const validUsers: Map<number, CustomerRecord> = new Map();

export function getCustomerByUsername(username: string) {
    for (const customer of validUsers.values()) {
        if (customer.username === username) {
        return customer;
        }
    }
    return undefined;
}

export function getCustomerByEmail(email: string) {
    for (const customer of validUsers.values()) {
        if (customer.email === email) {
        return customer;
        }
    }
    return undefined;
}

export function addCustomer(customer: CustomerRecord) {
    // Check if the username is already in use
    if (getCustomerByUsername(customer.username)) {
        throw new Error("Username already in use");
    }

    // Check if the email is already in use
    if (getCustomerByEmail(customer.email)) {
        throw new Error("Email already in use");
    }

    // Verify that the id is not larger than 2 bytes
    if (customer.id > 65535) {
        throw new Error("ID must be less than 65535");
    }

    // Verify that the username is less than 32 characters
    if (customer.username.length > 32) {
        throw new Error("Username must be less than 32 characters");
    }

    // Verify that the name is less than 32 characters
    if (customer.name.length > 32) {
        throw new Error("Name must be less than 32 characters");
    }

    // Add the customer to the list of valid users
    validUsers.set(customer.id, customer);
}

let nextId: number = 1;

addCustomer({
    id: nextId++,
    username: "admin",
    name: "Administrator",
    email: "",
    password: "admin",
});