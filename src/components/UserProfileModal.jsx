const UserProfileModal = ({ userInfo, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#1e2738] text-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-white text-lg"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">User Profile</h2>

        <div className="flex flex-col items-center">
          {userInfo?.profile_photo && (
            <img
              src={userInfo.profile_photo}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-500"
            />
          )}
          <p><strong>Username:</strong> {userInfo?.username}</p>
          <p><strong>Email:</strong> {userInfo?.email}</p>
          <p><strong>Subscription:</strong> {userInfo?.subscription_status}</p>
          <p><strong>Country:</strong> {userInfo?.country}</p>
          <p><strong>State:</strong> {userInfo?.state}</p>
          <p><strong>Phone:</strong> {userInfo?.phone_number || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
