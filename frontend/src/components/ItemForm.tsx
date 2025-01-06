import { Form, Input, InputNumber, Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { createItem } from '../store/itemSlice';
import { Item } from '../types/item';

interface ItemFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ItemForm = ({ visible, onCancel, onSuccess }: ItemFormProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (values: Omit<Item, 'id'>) => {
    try {
      await dispatch(createItem(values)).unwrap();
      message.success('Item created successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Failed to create item');
    }
  };

  return (
    <Modal
      title="Add New Item"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
  );
};

export default ItemForm;