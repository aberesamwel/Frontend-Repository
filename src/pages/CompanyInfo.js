import React from 'react';
import { Mail, Phone, MapPin, Truck, Wrench, Settings, Package } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { companyInfo } from '../config/company';

const CompanyInfo = () => {
  const { getThemeClass } = useTheme();

  return (
    <div className="p-6 space-y-6">
      {/* Company Header */}
      <div className={`${getThemeClass('bg', 'card')} rounded-xl p-8 shadow-lg border ${getThemeClass('border', 'primary')}`}>
        <div className="text-center">
          <div className="inline-block mb-4">
            <img src="/company-logo.svg" alt="PEX STEEL & FABRICATION LIMITED" className="w-full max-w-2xl h-auto" />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${getThemeClass('bg', 'card')} rounded-xl p-6 shadow-lg border ${getThemeClass('border', 'primary')}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className={`font-semibold ${getThemeClass('text', 'primary')}`}>Phone</h3>
          </div>
          <p className={`text-lg font-mono ${getThemeClass('text', 'secondary')}`}>{companyInfo.contact.phone}</p>
        </div>

        <div className={`${getThemeClass('bg', 'card')} rounded-xl p-6 shadow-lg border ${getThemeClass('border', 'primary')}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className={`font-semibold ${getThemeClass('text', 'primary')}`}>Email</h3>
          </div>
          <p className={`text-sm ${getThemeClass('text', 'secondary')} break-all`}>{companyInfo.contact.email}</p>
        </div>

        <div className={`${getThemeClass('bg', 'card')} rounded-xl p-6 shadow-lg border ${getThemeClass('border', 'primary')}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className={`font-semibold ${getThemeClass('text', 'primary')}`}>Location</h3>
          </div>
          <p className={`${getThemeClass('text', 'secondary')}`}>{companyInfo.contact.location}</p>
          <p className={`text-sm ${getThemeClass('text', 'muted')} mt-1`}>{companyInfo.contact.poBox}</p>
        </div>
      </div>

      {/* Services */}
      <div className={`${getThemeClass('bg', 'card')} rounded-xl p-6 shadow-lg border ${getThemeClass('border', 'primary')}`}>
        <h2 className={`text-2xl font-bold ${getThemeClass('text', 'primary')} mb-6`}>Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyInfo.services.map((service, index) => {
            const icons = [Truck, Wrench, Settings, Package, Truck, Wrench];
            const Icon = icons[index % icons.length];
            const colors = ['blue', 'green', 'purple', 'orange', 'indigo', 'red'];
            const color = colors[index % colors.length];
            
            return (
              <div key={index} className={`flex items-center space-x-3 p-4 bg-${color}-50 rounded-lg border border-${color}-200`}>
                <Icon className={`w-6 h-6 text-${color}-600 flex-shrink-0`} />
                <span className={`font-medium text-${color}-900`}>{service}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className={`${getThemeClass('bg', 'card')} rounded-xl p-6 shadow-lg border ${getThemeClass('border', 'primary')}`}>
        <h2 className={`text-2xl font-bold ${getThemeClass('text', 'primary')} mb-4`}>About Us</h2>
        <p className={`${getThemeClass('text', 'secondary')} leading-relaxed`}>
          {companyInfo.name} is a leading provider of motor fabrication and metal works services in {companyInfo.contact.location}. 
          We specialize in custom truck body building, metal sheet adjustments, motor repairs, and comprehensive maintenance services. 
          Our experienced team delivers quality craftsmanship and reliable solutions for all your vehicle fabrication needs.
        </p>
      </div>
    </div>
  );
};

export default CompanyInfo;
