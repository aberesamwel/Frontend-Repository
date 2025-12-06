/**
 * Contacts Manager Utility
 * 
 * Centralized contact management for all clients across:
 * - Truck Body Building projects
 * - Metal Works services
 */

export const contactsManager = {
  /**
   * Save or update a contact
   */
  saveContact(name, phone, source) {
    const contacts = this.getAllContacts();
    const existingIndex = contacts.findIndex(c => c.phone === phone);
    
    const contact = {
      name,
      phone,
      source, // 'truck' or 'metalworks' or 'both'
      lastUpdated: new Date().toISOString(),
      addedDate: existingIndex >= 0 ? contacts[existingIndex].addedDate : new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing contact
      contacts[existingIndex] = {
        ...contacts[existingIndex],
        ...contact,
        source: contacts[existingIndex].source !== source ? 'both' : source
      };
    } else {
      // Add new contact
      contacts.push(contact);
    }
    
    localStorage.setItem('pexsteel-contacts', JSON.stringify(contacts));
    return contact;
  },
  
  /**
   * Get all contacts
   */
  getAllContacts() {
    const saved = localStorage.getItem('pexsteel-contacts');
    return saved ? JSON.parse(saved) : [];
  },
  
  /**
   * Search contacts by name or phone
   */
  searchContacts(query) {
    const contacts = this.getAllContacts();
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.phone.includes(query)
    );
  },
  
  /**
   * Get contact by phone
   */
  getContactByPhone(phone) {
    const contacts = this.getAllContacts();
    return contacts.find(c => c.phone === phone);
  }
};
