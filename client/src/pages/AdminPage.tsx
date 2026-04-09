import React from "react";

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-backgroundLight p-8">
      <h1 className="text-h1 font-heading mb-6">Adminpanel</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p>Här kommer adminverktyg för:</p>

        <ul className="list-disc pl-6 mt-4">
          <li>Hantera rum</li>
          <li>Hantera användare</li>
          <li>Hantera bokningar</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
