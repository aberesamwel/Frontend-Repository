import React, { useState, useEffect } from 'react';
import { Phone, Search, Users, Truck, Scissors, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { contactsManager } from '../utils/contactsManager';

const Contacts = () => {
  const { getThemeClass } = useTheme();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('all');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const allContacts = contactsManager.getAllContacts();
    setContacts(allContacts);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesFilter = filterSource === 'all' || contact.source === filterSource || contact.source === 'both';
    return matchesSearch && matchesFilter;
  });

  const getSourceBadge = (source) => {
    if (source === 'truck') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          <Truck className="w-3 h-3 mr-1" />
          Truck Body
        </span>
      );
    } else if (source === 'metalworks') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          <Scissors className="w-3 h-3 mr-1" />
          Metal Works
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          <Users className="w-3 h-3 mr-1" />
          Both Services
        </span>
      );
    }
  };

  const stats = {
    total: contacts.length,
    truck: contacts.filter(c => c.source === 'truck' || c.source === 'both').length,
    metalworks: contacts.filter(c => c.source === 'metalworks' || c.source === 'both').length,
    both: contacts.filter(c => c.source === 'both').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${getThemeClass('text', 'primary')} flex items-center`}>
          <Phone className="w-7 h-7 mr-3 text-blue-600" />
          Client Contacts
        </h1>
        <p className={`${getThemeClass('text', 'tertiary')} mt-1`}>
          All saved client contacts from truck body and metal works services
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl p-4 border ${getThemeClass('border', 'primary')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'secondary')}`}>Total Contacts</p>
              <p className={`text-2xl font-bold ${getThemeClass('text', 'primary')} mt-1`}>{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl p-4 border ${getThemeClass('border', 'primary')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'secondary')}`}>Truck Body</p>
              <p className={`text-2xl font-bold ${getThemeClass('text', 'primary')} mt-1`}>{stats.truck}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl p-4 border ${getThemeClass('border', 'primary')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'secondary')}`}>Metal Works</p>
              <p className={`text-2xl font-bold ${getThemeClass('text', 'primary')} mt-1`}>{stats.metalworks}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Scissors className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClass('bg', 'secondary')} rounded-xl p-4 border ${getThemeClass('border', 'primary')}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${getThemeClass('text', 'secondary')}`}>Both Services</p>
              <p className={`text-2xl font-bold ${getThemeClass('text', 'primary')} mt-1`}>{stats.both}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl p-4 border ${getThemeClass('border', 'primary')}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${getThemeClass('text', 'tertiary')}`} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-10 py-2 border ${getThemeClass('border', 'primary')} rounded-lg ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${getThemeClass('text', 'tertiary')} hover:${getThemeClass('text', 'primary')}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterSource('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSource === 'all'
                  ? 'bg-blue-600 text-white'
                  : `${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')}`
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterSource('truck')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSource === 'truck'
                  ? 'bg-blue-600 text-white'
                  : `${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')}`
              }`}
            >
              <Truck className="w-4 h-4 inline mr-1" />
              Truck
            </button>
            <button
              onClick={() => setFilterSource('metalworks')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterSource === 'metalworks'
                  ? 'bg-orange-600 text-white'
                  : `${getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')}`
              }`}
            >
              <Scissors className="w-4 h-4 inline mr-1" />
              Metal
            </button>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className={`${getThemeClass('bg', 'secondary')} rounded-xl shadow-sm border ${getThemeClass('border', 'primary')} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${getThemeClass('bg', 'tertiary')} border-b ${getThemeClass('border', 'primary')}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>
                  Client Name
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>
                  Phone Number
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>
                  Service Type
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClass('text', 'secondary')} uppercase tracking-wider`}>
                  Added Date
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${getThemeClass('border', 'primary')}`}>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`px-6 py-8 text-center ${getThemeClass('text', 'tertiary')}`}>
                    {searchTerm ? 'No contacts found matching your search' : 'No contacts saved yet'}
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact, index) => (
                  <tr key={index} className={`hover:${getThemeClass('bg', 'hover')} transition-colors`}>
                    <td className={`px-6 py-4 whitespace-nowrap ${getThemeClass('text', 'primary')} font-medium`}>
                      {contact.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${getThemeClass('text', 'secondary')}`}>
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition-colors">
                        {contact.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSourceBadge(contact.source)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${getThemeClass('text', 'secondary')} text-sm`}>
                      {new Date(contact.addedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
