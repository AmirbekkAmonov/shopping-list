import React, { useState } from "react";
import { Modal, Input, Dropdown, Button, List } from "antd";
import { useParams } from "react-router-dom";
import { useStore } from "@/hooks/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useMember } from "@/hooks/useGroups";

function GroupPage() {
  const { id } = useParams();
  const groups = useStore((state) => state.groups);
  const group = groups.find((g) => g.id === Number(id));
  const user = useStore((state) => state.user);
  const [member, setMember] = useState('');
  const { members, isLoadingMember, isErrorMember } = useMember(member);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!group) {
    return <h2>Guruh topilmadi!</h2>;
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
      label: "Delete Group",
      key: "delete-group",
      onClick: () => console.log("Delete group clicked"),
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
              <span>{user?.username ? user.username[0].toUpperCase() : ""}</span>
              {user ? user.username : "No username"} ({user ? user.name : "Guest"})
            </p>
          </div>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <button onClick={(e) => e.preventDefault()} className="menu-btn-group">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </Dropdown>
        </div>
      </div>

      <div className="group-content">
        <div className="group-info">
          <div className="group-description">
            <h4>Items <span>0</span></h4>
            <div className="group-items">
              <input type="text" className="input" placeholder="Add Title" />
              <button className="add-item">+</button>
            </div>
          </div>
        </div>
        <div className="group-members">
          <div className="group-description">
            <h4>Members <span>0</span></h4>
          </div>
        </div>
      </div>

      <Modal
        title="Add New Member"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
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
        />
        <List
          bordered
          dataSource={members}
          loading={isLoadingMember}
          renderItem={(item) => (
            <List.Item onClick={() => handleSelectMember(item)} style={{ cursor: "pointer" }}>
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
