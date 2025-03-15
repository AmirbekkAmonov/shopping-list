import React, { useEffect, useState } from "react";
import { Modal, Input, Dropdown, Button, List, Spin } from "antd";
import { useParams } from "react-router-dom";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import {
  useMyGroups,
  useMember,
  useConfirmLeaveGroup,
  useConfirmDeleteGroup
} from "@/hooks/useGroups";
import { useStore } from "@/hooks/useStore";


function GroupPage() {
  const { id } = useParams();
  const { myGroups, isLoadingMyGroups } = useMyGroups();
  const group = myGroups.find((g) => String(g._id) === String(id));
  const [member, setMember] = useState('');
  const { members, isLoadingMember, isErrorMember } = useMember(member);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useStore((state) => state.user);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const confirmLeaveGroup = useConfirmLeaveGroup();
  const confirmDeleteGroup = useConfirmDeleteGroup();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    },5000);

    return () => clearTimeout(timer);
  }, []);

  if (!group) {
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        {loadingTimeout ? (
          <p style={{ color: "red", fontSize: "18px", textAlign: "center" }}>
            Ma'lumot yuklanmadi. Iltimos, qayta urinib ko'ring!
          </p>
        ) : (
          <Spin size="large" />
        )}
      </div>
    );
  }
  if (isLoadingMyGroups) {
    return <Spin size="large" />;
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setMember("");
  };
  const handleSelectMember = (member) => {
    Modal.confirm({
      title: "Confirm Member Addition",
      content: `Do you want to add ${member.name} (@${member.username}) to the group?`,
      onOk: () => handleAddMember(member),
      okText: "Yes",
      cancelText: "No",
    });
  };

  const handleAddMember = () => {
    console.log("Added member:", member);
    setIsModalOpen(false);
    setMember("");
  };
  const items = [
    {
      label: "Add Member",
      key: "add-member",
      onClick: showModal,
    },
    {
      type: "divider",
    },
    {
      label: user.username === group.owner.username ? "Delete Group" : "Leave Group",
      key: "delete-group",
      onClick: () => {
        if (user.username === group.owner.username) {
          confirmDeleteGroup(group._id);
        } else {
          confirmLeaveGroup(group._id);
        }
      },
      danger: true,
    },
  ];

  return (
    <div className="group-page">
      <div className="group-header">
        <h3>{group.name}</h3>
        <div className="group-actions">
          <div className="owner">
            <h3>Owner:</h3>
            <p>
              <span>{group?.owner?.name ? group.owner.name[0].toUpperCase() : ""}</span>
              {group?.owner?.name ? group.owner.name.charAt(0).toUpperCase() + group.owner.name.slice(1) : "Guest"}
              ({group?.owner ? group.owner.username : "No username"})
            </p>
          </div>
          <Dropdown menu={{ items }} trigger={["click"]} overlayClassName="custom-dropdown">
            <button onClick={(e) => e.preventDefault()} className="menu-btn-group">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </Dropdown>
        </div>
      </div>
      <div className="group-content">
        <div className="group-info">
          <div className="group-description">
            <h4>Items <span>{group.items.length}</span></h4>
            <div className="group-items">
              <input type="text" className="input" placeholder="Add Title" />
              <button className="add-item">+</button>
            </div>
          </div>
          <ul className="items-list">
            {group.items.length > 0 ? (
              group.items.map((item, index) => (
                <li key={`${item._id}-${index}`} className="item-card">
                  <div className="avatar">{item.title[0].toUpperCase()}</div>
                  <div className="item-content">
                    <h4 className="item-title">{item.title}</h4>
                    <p className="item-meta">
                      Created By {group.owner?.name || "Unknown"} (
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      ,{new Date(item.createdAt).toLocaleDateString()})
                    </p>
                  </div>
                  <div className="item-actions">
                    <button className="btn green">
                      <FaShoppingCart />
                    </button>
                    {user?.username === group?.owner?.username && (
                      <button className="btn red">
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p>Hozircha hech qanday item yo'q.</p>
            )}
          </ul>
        </div>

        <div className="group-members">
          <div className="group-description">
            <h4>
              Members <span>{group.members.length}</span>
            </h4>
          </div>
          <ul className="members-list">
            {group.members.map((member, index) => (
              <li key={`${member.id}-${index}`} className="member-item">
                <div className="avatar">{member.username[0].toUpperCase()}</div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-username">{member.username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal
        className="custom-modal"
        title="Add New Member"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} className="cancel-btn">
            Cancel
          </Button>
        ]}
        styles={{
          body: { height: "300px" },
          content: { maxWidth: "500px" },
        }}
      >
        <Input
          placeholder="Enter member name"
          value={member}
          onChange={(e) => setMember(e.target.value)}
          className="member-input"
        />
        <List
          bordered
          dataSource={members}
          loading={isLoadingMember}
          renderItem={(item) => (
            <List.Item onClick={() => handleSelectMember(item)} style={{ cursor: "pointer" }} className="member-item">
              {item.username} (@{item.name})
            </List.Item>
          )}
          style={{ marginTop: "10px", maxHeight: "250px", overflowY: "auto", scrollbarWidth: "none" }}
        />
        {isErrorMember && <p style={{ color: "red" }}>Error loading members</p>}
      </Modal>
    </div>
  );
}

export default GroupPage;
