const Contact = require('../models/Contact');

// Create a new contact inquiry
exports.createContact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, msg: 'Name, email, and message are required.' });
    }

    try {
        const newContact = new Contact({
            name: name.trim(),
            email: email.trim(),
            subject: subject ? subject.trim() : 'General Inquiry',
            message: message.trim()
        });

        await newContact.save();
        res.status(201).json({ success: true, data: newContact, msg: 'Contact form submitted successfully!' });
    } catch (err) {
        console.error('Error submitting contact form:', err);
        res.status(500).json({ success: false, msg: 'Server Error submitting contact form' });
    }
};

// Get all contact inquiries (admin only)
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: contacts });
    } catch (err) {
        console.error('Error fetching contact inquiries:', err);
        res.status(500).json({ success: false, msg: 'Server Error fetching contact inquiries' });
    }
};

// Delete a contact inquiry (admin only)
exports.deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ success: false, msg: 'Contact inquiry not found.' });
        }

        await Contact.findByIdAndDelete(id);
        res.json({ success: true, msg: 'Contact inquiry marked as resolved and deleted.' });
    } catch (err) {
        console.error('Error deleting contact inquiry:', err);
        res.status(500).json({ success: false, msg: 'Server Error deleting contact inquiry' });
    }
};
