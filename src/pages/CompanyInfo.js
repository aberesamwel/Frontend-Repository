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
      <div className={`${getThemeClass('bg', 'card')} rounded-xl shadow-lg border ${getThemeClass('border', 'primary')} overflow-hidden`}>
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">About Pexsteel</h2>
              <p className="text-blue-100 mt-1">Excellence in Metal Works & Truck Body Building</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Story */}
            <div>
              <h3 className={`text-xl font-semibold ${getThemeClass('text', 'primary')} mb-4 flex items-center`}>
                <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                Our Story
              </h3>
              <p className={`${getThemeClass('text', 'secondary')} leading-relaxed mb-4`}>
                {companyInfo.name} stands as a premier destination for motor fabrication and metal works services in {companyInfo.contact.location}. 
                With years of expertise in the industry, we have built a reputation for delivering exceptional quality and innovative solutions.
              </p>
              <p className={`${getThemeClass('text', 'secondary')} leading-relaxed`}>
                Our skilled craftsmen combine traditional metalworking techniques with modern technology to create durable, 
                custom solutions that exceed our clients' expectations.
              </p>
            </div>
            
            {/* Expertise */}
            <div>
              <h3 className={`text-xl font-semibold ${getThemeClass('text', 'primary')} mb-4 flex items-center`}>
                <div className="w-2 h-6 bg-green-600 rounded-full mr-3"></div>
                Our Expertise
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className={`${getThemeClass('text', 'secondary')}`}>Custom truck body building and modifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`${getThemeClass('text', 'secondary')}`}>Precision metal sheet cutting and welding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className={`${getThemeClass('text', 'secondary')}`}>Comprehensive motor repair services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className={`${getThemeClass('text', 'secondary')}`}>Professional maintenance and restoration</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Values */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className={`text-xl font-semibold ${getThemeClass('text', 'primary')} mb-6 text-center`}>Why Choose Pexsteel?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-2`}>Quality Craftsmanship</h4>
                <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Every project is executed with precision and attention to detail</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Wrench className="w-6 h-6 text-green-600" />
                </div>
                <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-2`}>Expert Team</h4>
                <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Experienced professionals with years of industry knowledge</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className={`font-semibold ${getThemeClass('text', 'primary')} mb-2`}>Reliable Service</h4>
                <p className={`text-sm ${getThemeClass('text', 'muted')}`}>Timely delivery and dependable solutions for all your needs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
