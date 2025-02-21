"use client";
import { useState } from "react";

const Filter = () => {
  // Add state for parent checkboxes
  const [showDorms, setShowDorms] = useState(false);
  const [showUniversityApts, setShowUniversityApts] = useState(false);

  return (
    <div className="w-64 h-full bg-gray-50 p-5 border-r border-gray-200">
      {/* Search by Name Filter Section */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-2 underline">
          Search by Name
        </h3>
        <input
          type="text"
          placeholder="Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <hr className="border-t border-gray-200 my-4" />

      {/* Grade Filter Section */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-2 underline">Grade</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">First Year</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Second Year</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Third Year</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Fourth Year</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Fifth Year and Above</span>
          </label>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />

      {/* Gender Filter Section */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-2 underline">Gender</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Male</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Female</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Non-binary</span>
          </label>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />

      {/* Building Filter Section */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-2 underline">Building</h3>
        <div className="space-y-2">
          {/* Dorms */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={showDorms}
                onChange={(e) => setShowDorms(e.target.checked)}
              />
              <span className="text-gray-700 font-medium">Dorms</span>
            </label>
            {showDorms && (
              <div className="ml-6 mt-1 space-y-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">De Neve</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Dykstra</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Rieber</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Sproul</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Hedrick</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Sunset Village</span>
                </label>
              </div>
            )}
          </div>

          {/* University Apartments */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={showUniversityApts}
                onChange={(e) => setShowUniversityApts(e.target.checked)}
              />
              <span className="text-gray-700 font-medium">
                University Apartments
              </span>
            </label>
            {showUniversityApts && (
              <div className="ml-6 mt-1 space-y-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Gayley Court</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Gayley Heights</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Glenrock</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Gayley Towers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Glenrock West</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Landfair</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">Landfair Vista</span>
                </label>
              </div>
            )}
          </div>

          {/* Off-Campus Apartments */}
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700 font-medium">
              Off-Campus Apartments
            </span>
          </label>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />

      {/* Individual Preferences Section */}
      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-2 underline">
          Individual Preferences
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Early Bird</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Night Owl</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-blue-600" />
            <span className="text-gray-700">Quiet Study Environment</span>
          </label>
        </div>
      </div>

      {/* Apply Button */}
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-6">
        Apply Filter(s)
      </button>
    </div>
  );
};

export default Filter;
