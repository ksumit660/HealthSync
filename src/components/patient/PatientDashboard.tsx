import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentPatient, mockLogout } from '../../services/mockAuthService';
import { dummyAirQualityData, dummyDoctors } from '../../data/dummyPatientData';
import { FaHeartbeat, FaWalking, FaBed, FaFire, FaLink, FaUserCircle } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import { Menu, X } from 'lucide-react';
import ContactForm from '../contact/ContactForm';
import { QRCodeSVG } from 'qrcode.react';

interface ReportModalProps {
  report: any;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{report.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600">Report Date: {report.date}</p>
            <p className="text-gray-600">Hospital: {report.hospital}</p>
            <p className="text-gray-600">Doctor: {report.doctor || 'Dr. Smith'}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Findings</h3>
            <p>{report.findings || 'All parameters are within normal range.'}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results</h3>
            <div className="grid grid-cols-2 gap-4">
              {report.testResults?.map((result: any, index: number) => (
                <div key={index} className="border p-3 rounded">
                  <p className="font-medium">{result.name}</p>
                  <p className="text-gray-600">Value: {result.value}</p>
                  <p className="text-gray-600">Normal Range: {result.range}</p>
                </div>
              )) || (
                <>
                  <div className="border p-3 rounded">
                    <p className="font-medium">Blood Pressure</p>
                    <p className="text-gray-600">Value: 120/80 mmHg</p>
                    <p className="text-gray-600">Normal Range: 90/60-120/80</p>
                  </div>
                  <div className="border p-3 rounded">
                    <p className="font-medium">Heart Rate</p>
                    <p className="text-gray-600">Value: 72 bpm</p>
                    <p className="text-gray-600">Normal Range: 60-100</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Recommendations</h3>
            <p>{report.recommendations || 'Continue with current medications. Follow up in 3 months.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfileModalProps {
  patient: any;
  onClose: () => void;
}

interface QRModalProps {
  data: any;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ data, onClose }) => {
  const qrData = JSON.stringify({
    patientId: data.id,
    reports: data.medicalReports.map((r: any) => ({
      id: r.id,
      name: r.name,
      url: r.url
    })),
    records: data.healthRecords.map((r: any) => ({
      id: r.id,
      date: r.date,
      diagnosis: r.diagnosis
    }))
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Scan QR Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              value={qrData}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Scan this QR code to access all your medical reports and records
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileModal: React.FC<ProfileModalProps> = ({ patient, onClose }) => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Patient Profile</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowQRCode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              Generate QR Code
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <FaUserCircle className="w-16 h-16 text-blue-500" />
            <div>
              <h3 className="text-xl font-semibold">{patient.name}</h3>
              <p className="text-gray-600">Patient ID: {patient.id}</p>
              <p className="text-gray-600">{patient.email}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Address</h4>
            <p>{patient.address.street}</p>
            <p>{patient.address.city}, {patient.address.state}</p>
            <p>PIN: {patient.address.pincode}</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Recent Health Records</h4>
            <div className="space-y-2">
              {patient.healthRecords.slice(0, 2).map((record: any) => (
                <div key={record.id} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{record.date}</p>
                  <p>Diagnosis: {record.diagnosis}</p>
                  <p className="text-sm text-gray-600">{record.hospital}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Upcoming Appointments</h4>
            <div className="space-y-2">
              {patient.appointments
                .filter((app: any) => app.status === 'Scheduled')
                .map((app: any) => (
                  <div key={app.id} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{app.date} at {app.time}</p>
                    <p>With: {app.doctorName}</p>
                    <p className="text-sm text-gray-600">{app.hospitalName}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Add new Reports Section after Upcoming Appointments */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Quick Reports Access</h4>
              <span className="text-sm text-gray-500">{patient.medicalReports.length} Reports</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patient.medicalReports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="View Report"
                    >
                      View
                    </button>
                    <a
                      href={report.url}
                      download={report.name}
                      className="p-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      title="Download Report"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
              {patient.medicalReports.length === 0 && (
                <p className="text-gray-500 col-span-2 text-center py-4">No medical reports available</p>
              )}
            </div>
          </div>

          {/* You can keep or add a footer with action buttons */}
          <div className="border-t mt-6 pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedReport.name}</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-gray-600">Report Date: {selectedReport.date}</p>
                  <p className="text-gray-600">Hospital: {selectedReport.hospital}</p>
                  <p className="text-gray-600">Type: {selectedReport.type}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p>{selectedReport.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Test Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border p-3 rounded">
                      <p className="font-medium">Blood Pressure</p>
                      <p className="text-gray-600">Value: 120/80 mmHg</p>
                      <p className="text-gray-600">Normal Range: 90/60-120/80</p>
                    </div>
                    <div className="border p-3 rounded">
                      <p className="font-medium">Heart Rate</p>
                      <p className="text-gray-600">Value: 72 bpm</p>
                      <p className="text-gray-600">Normal Range: 60-100</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <a
                    href={selectedReport.url}
                    download={selectedReport.name}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Download Report
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {showQRCode && (
          <QRModal
            data={patient}
            onClose={() => setShowQRCode(false)}
          />
        )}
      </div>
    </div>
  );
};

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('health-records');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patient, setPatient] = useState(getCurrentPatient());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState(patient?.appointments || []);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    { id: 'health-records', label: 'Health Records' },
    { id: 'location', label: 'Location & Air Quality' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'reports', label: 'Medical Reports' },
    { id: 'upload', label: 'Upload Reports' },
    { id: 'device-connection', label: 'Device Connection' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const checkAuth = () => {
      const currentPatient = getCurrentPatient();
      if (!currentPatient) {
        navigate('/login');
      } else {
        setPatient(currentPatient);
        // Check if location prompt has been shown before
        const hasShownLocationPrompt = localStorage.getItem('locationPromptShown');
        if (!hasShownLocationPrompt) {
          setShowLocationPrompt(true);
          localStorage.setItem('locationPromptShown', 'true');
        } else {
          setShowLocationPrompt(false);
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await mockLogout();
    navigate('/login');
  };

  if (!patient) {
    return null;
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Report uploaded successfully!');
    }
  };

  const handleAppointmentBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const doctorId = formData.get('doctorId') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;

    const selectedDoctor = dummyDoctors.find(doc => doc.id === doctorId);
    
    if (!selectedDoctor) {
      alert('Please select a doctor');
      return;
    }

    const newAppointment = {
      id: `app-${Date.now()}`,
      type: 'Regular Checkup',
      doctorName: selectedDoctor.name,
      date: date,
      time: time,
      hospitalName: selectedDoctor.hospital,
      status: 'Scheduled'
    };

    setAppointments(prev => [...prev, newAppointment]);
    
    // Update patient state with new appointments
    setPatient(prev => prev ? {
      ...prev,
      appointments: [...prev.appointments, newAppointment]
    } : null);

    // Reset form
    event.currentTarget.reset();
    alert('Appointment booked successfully!');
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setShowLocationPrompt(false);
          localStorage.setItem('locationPermission', 'granted');
        },
        (error) => {
          console.error('Error getting location:', error);
          setShowLocationPrompt(false);
          localStorage.setItem('locationPermission', 'denied');
        }
      );
    }
  };

  // Add this new function
  const handleDeclineLocation = () => {
    setShowLocationPrompt(false);
    localStorage.setItem('locationPermission', 'denied');
    localStorage.setItem('locationPromptShown', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {showLocationPrompt && (
        <div className="fixed inset-x-0 top-0 p-4 bg-blue-500 text-white z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p>Allow HealthSync to access your location for better service?</p>
            <div className="flex space-x-4">
              <button
                onClick={handleLocationPermission}
                className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-blue-50"
              >
                Allow
              </button>
              <button
                onClick={handleDeclineLocation}
                className="px-4 py-2 border border-white rounded hover:bg-blue-600"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <FaUserCircle 
                className="w-10 h-10 text-blue-500 cursor-pointer hover:text-blue-600"
                onClick={() => setShowProfile(true)}
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                View your profile
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">Welcome, {patient.name}</h1>
          </div>
          {/* Show patient ID and logout only on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <p className="text-sm md:text-base text-gray-600">Patient ID: {patient.id}</p>
            <button
              onClick={handleLogout}
              className="px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button - Moved to right */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center px-3 py-2 rounded-lg bg-white shadow-sm"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-gray-600 border-b pb-2">Patient ID: {patient.id}</p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 rounded mb-2 ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} mb-4`}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full px-4 py-3 text-left ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                } border-b border-gray-100 last:border-b-0`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'health-records' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Health Records</h2>
              <div className="space-y-4">
                {patient.healthRecords.map((record) => (
                  <div key={record.id} className="border p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Date: {record.date}</p>
                        <p>Diagnosis: {record.diagnosis}</p>
                        <p>Prescription: {record.prescription}</p>
                        <p>Doctor: {record.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600">{record.hospital}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {patient.healthRecords.length === 0 && (
                  <p className="text-gray-500">No health records found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Location & Air Quality</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded">
                  <h3 className="text-lg font-semibold mb-3">Your Address</h3>
                  <p>{patient.address.street}</p>
                  <p>{patient.address.city}, {patient.address.state}</p>
                  <p>PIN: {patient.address.pincode}</p>
                </div>
                <div className="border p-4 rounded">
                  <h3 className="text-lg font-semibold mb-3">Air Quality Information</h3>
                  <p className="font-semibold">Air Quality Index: {dummyAirQualityData.aqi}</p>
                  <p>Main Pollutant: {dummyAirQualityData.mainPollutant}</p>
                  <p>Quality: {dummyAirQualityData.quality}</p>
                  <p className="mt-2">Location: {dummyAirQualityData.location.city}, {dummyAirQualityData.location.state}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Book New Appointment</h3>
                  <form onSubmit={handleAppointmentBooking} className="space-y-4">
                    <div>
                      <label className="block mb-2">Select Doctor</label>
                      <select name="doctorId" className="w-full p-2 border rounded">
                        <option value="">Select a doctor</option>
                        {dummyDoctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization} ({doctor.hospital})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        className="w-full p-2 border rounded"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Time</label>
                      <input
                        type="time"
                        name="time"
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Book Appointment
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Appointment History</h3>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{appointment.type}</p>
                            <p>Doctor: {appointment.doctorName}</p>
                            <p>Date: {appointment.date}</p>
                            <p>Time: {appointment.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-600">{appointment.hospitalName}</p>
                            <p className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                              appointment.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <p className="text-gray-500">No appointment history.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Medical Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patient.medicalReports.map((report) => (
                  <div key={report.id} className="border p-4 rounded hover:shadow-lg transition-shadow">
                    <div className="flex flex-col h-full">
                      <div>
                        <h3 className="font-semibold text-lg">{report.name}</h3>
                        <p className="text-sm text-gray-600">{report.date}</p>
                        <p className="text-blue-600">{report.hospital}</p>
                        <p className="text-sm text-gray-700 mt-2">{report.description}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm">
                          {report.type}
                        </span>
                        <button 
                          className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          onClick={() => setSelectedReport(report)}
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {patient.medicalReports.length === 0 && (
                  <p className="text-gray-500 col-span-3">No medical reports available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upload Medical Reports</h2>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'device-connection' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Connect Your Device for Real-Time Health Monitoring</h2>
              <p className="text-gray-600 mb-6">
                Connect your smartphone or smartwatch to automatically sync your health data with our platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-3">
                    <GiHealthNormal className="text-blue-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Blood Pressure</h3>
                  </div>
                  <p className="text-gray-600">Monitor your daily readings and track trends over time.</p>
                </div>

                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-center mb-3">
                    <FaHeartbeat className="text-red-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Heart Rate</h3>
                  </div>
                  <p className="text-gray-600">Keep track of your heart beats per minute and overall heart health.</p>
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center mb-3">
                    <FaWalking className="text-green-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Step Count</h3>
                  </div>
                  <p className="text-gray-600">View your daily steps and activity levels to stay on top of your fitness goals.</p>
                </div>

                <div className="border rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center mb-3">
                    <FaBed className="text-purple-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Sleep Data</h3>
                  </div>
                  <p className="text-gray-600">Track your sleep patterns for better rest and recovery.</p>
                </div>

                <div className="border rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center mb-3">
                    <FaFire className="text-orange-500 text-2xl mr-2" />
                    <h3 className="text-lg font-semibold">Calorie Burn</h3>
                  </div>
                  <p className="text-gray-600">See how many calories you burn throughout the day.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Device Connection</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaLink className="text-blue-500 h-6 w-6 mr-2" />
                    <div>
                      <p className="font-medium">Connect Your Health Devices</p>
                      <p className="text-sm text-gray-600">Link your health monitoring devices for real-time data</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Connect Device
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => alert('Device connection feature coming soon!')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaLink className="mr-2" />
                  Connect Your Device Now
                </button>
              </div>
            </div>
          )}
          {activeTab === 'contact' && (
            <ContactForm userType="patient" />
          )}
        </div>
        {selectedReport && (
          <ReportModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
        {showProfile && (
          <ProfileModal
            patient={patient}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
