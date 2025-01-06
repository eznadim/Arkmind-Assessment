import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Space, Button, Popconfirm, message, Modal, Form, Input, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AppDispatch, RootState } from '../store/store';
import { fetchItems, deleteItem, updateItem } from '../store/itemSlice';
import { Item } from '../types/item';
import { SortOrder } from 'antd/es/table/interface';

const ItemList = () => {
  const [editForm] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteItem(id)).unwrap();
      message.success('Item deleted successfully');
    } catch (error) {
      message.error('Failed to delete item');
    }
  };

  const handleEdit = (record: Item) => {
    setEditingItem(record);
    editForm.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: Omit<Item, 'id'>) => {
    if (!editingItem?.id) return;
    try {
      const formattedValues = {
        ...values,
        price: Number(values.price)
      };
      await dispatch(updateItem({ id: editingItem.id, item: formattedValues })).unwrap();
      message.success('Item updated successfully');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update item');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Item, b: Item) => (a.id ?? 0) - (b.id ?? 0),
      defaultSortOrder: 'ascend' as SortOrder,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Item, b: Item) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${Number(price).toFixed(2)}`,
      sorter: (a: Item, b: Item) => Number(a.price) - Number(b.price),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Item) => (
        <Space>
          <Button 
            icon={<EditOutlined />}
            type="primary"
            ghost
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />}
              type="primary"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        className="bg-white rounded-lg shadow"
      />

      <Modal
        title="Edit Item"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => editForm.submit()}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter item description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter item price' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              prefix="$"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ItemList;