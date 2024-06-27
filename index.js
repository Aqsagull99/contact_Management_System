import inquirer from 'inquirer';
import chalk from 'chalk'; // Import chalk for color formatting
class Contact {
    name;
    phone;
    email;
    homeAddress;
    constructor(n, p, e, h) {
        this.name = n;
        this.phone = p;
        this.email = e;
        this.homeAddress = h;
    }
    toString() {
        return `Name: ${this.name} Phone: ${this.phone} Email: ${this.email} Home Address: ${this.homeAddress}`;
    }
    getHomeAddress() {
        return this.homeAddress;
    }
    setHomeAddress(address) {
        this.homeAddress = address;
    }
}
class ContactManagerOne {
    contacts = [];
    addContact(contact) {
        this.contacts.push(contact);
    }
    deleteContact(name) {
        this.contacts = this.contacts.filter(contact => contact.name !== name);
    }
    findContact(name) {
        return this.contacts.find(contact => contact.name === name);
    }
    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
        console.log(chalk.green('Contacts saved!')); // Color formatted output
    }
    loadContacts() {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
            this.contacts = JSON.parse(savedContacts);
        }
    }
    listAllContacts() {
        this.contacts.forEach(contact => {
            console.log(contact.toString());
        });
    }
    updateContact(name, updatedContact) {
        const contact = this.findContact(name);
        if (contact) {
            contact.name = updatedContact.name || contact.name;
            contact.phone = updatedContact.phone || contact.phone;
            contact.email = updatedContact.email || contact.email;
            if (updatedContact.getHomeAddress) {
                contact.setHomeAddress(updatedContact.getHomeAddress());
            }
            console.log(chalk.blue('Contact updated!')); // Color formatted output
        }
    }
}
class ContactManagerApp {
    contactManager = new ContactManagerOne();
    async start() {
        console.log(chalk.yellow('Welcome to Contact Manager App!')); // Color formatted output
        await this.showMenu();
    }
    async showMenu() {
        const answers = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add Contact',
                'Delete Contact',
                'Find Contact',
                'List All Contacts',
                'Save Contacts',
                'Update Contact',
                'Exit'
            ],
        });
        switch (answers.action) {
            case 'Add Contact':
                await this.addContact();
                break;
            case 'Delete Contact':
                await this.deleteContact();
                break;
            case 'Find Contact':
                await this.findContact();
                break;
            case 'List All Contacts':
                this.contactManager.listAllContacts();
                break;
            case 'Update Contact':
                await this.updateContact();
                break;
            case 'Save Contacts':
                this.contactManager.saveContacts();
                break;
            case 'Exit':
                console.log(chalk.yellow('Goodbye!')); // Color formatted output
                return;
        }
        await this.showMenu();
    }
    async addContact() {
        const answers = await inquirer.prompt([
            { name: 'name', type: 'input', message: 'Enter name:' },
            { name: 'phone', type: 'input', message: 'Enter phone:' },
            { name: 'email', type: 'input', message: 'Enter email:' },
            { name: 'homeAddress', type: 'input', message: 'Enter home address:' }
        ]);
        const contact = new Contact(answers.name, Number(answers.phone), answers.email, answers.homeAddress);
        this.contactManager.addContact(contact);
        console.log(chalk.green('Contact added!')); // Color formatted output
    }
    async deleteContact() {
        const answers = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'Enter name of contact to delete:'
        });
        this.contactManager.deleteContact(answers.name);
        console.log(chalk.red('Contact deleted!')); // Color formatted output
    }
    async findContact() {
        const answers = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'Enter name of contact to find:'
        });
        const contact = this.contactManager.findContact(answers.name);
        if (contact) {
            console.log(contact.toString());
        }
        else {
            console.log(chalk.yellow('Contact not found!')); // Color formatted output
        }
    }
    async updateContact() {
        const answers = await inquirer.prompt([
            { name: 'name', type: 'input', message: 'Enter name of contact to update:' },
            { name: 'newName', type: 'input', message: 'Enter new name (leave blank to keep current):' },
            { name: 'newPhone', type: 'input', message: 'Enter new phone (leave blank to keep current):' },
            { name: 'newEmail', type: 'input', message: 'Enter new email (leave blank to keep current):' },
            { name: 'newHomeAddress', type: 'input', message: 'Enter new home address (leave blank to keep current):' }
        ]);
        const updatedContact = {};
        if (answers.newName) {
            updatedContact.name = answers.newName;
        }
        if (answers.newPhone) {
            updatedContact.phone = Number(answers.newPhone);
        }
        if (answers.newEmail) {
            updatedContact.email = answers.newEmail;
        }
        if (answers.newHomeAddress) {
            updatedContact.getHomeAddress = answers.newHomeAddress;
        }
        this.contactManager.updateContact(answers.name, updatedContact);
    }
}
const app = new ContactManagerApp();
app.start();
