import { useState } from 'react';
import { Provider } from 'react-redux';
import { Layout, Typography, Button, Modal, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { itemsApi } from './services/api';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import { store } from './store/store';
import dayjs from 'dayjs';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchId, setSearchId] = useState('');

  const handleSearch = async () => {
    try {
      const id = parseInt(searchId);
      if (isNaN(id)) {
        message.error('Please enter a valid number');
        return;
      }
      
      const response = await itemsApi.getById(id);
      Modal.info({
        title: 'Item Details',
        content: (
          <div>
            <p><strong>Name:</strong> {response.data.name}</p>
            <p><strong>Description:</strong> {response.data.description}</p>
            <p><strong>Price:</strong> ${response.data.price}</p>
            <p><strong>Created At:</strong> {dayjs(response.data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
            <p><strong>Updated At:</strong> {dayjs(response.data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          </div>
        ),
      });
      setIsSearchModalVisible(false);
      setSearchId('');
    } catch (error) {
      message.error('Item not found');
    }
  };

  return (
    <Provider store={store}>
      <Layout className="layout-container">
        <Header className="header">
          <div className="header-content">
            <Title level={3} className="!mb-0 !text-gray-800">Item Management System</Title>
          </div>
        </Header>
        
        <Content className="main-content">
          <div className="content-header">
            <Title level={4} className="!mb-0">Item List</Title>
            <div className="button-group">
              <Button 
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalVisible(true)}
                style={{ marginRight: 8 }}
              >
                Search by ID
              </Button>
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Add New Item
              </Button>
            </div>
          </div>
          
          <ItemList />
          
          <ItemForm 
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onSuccess={() => setIsModalVisible(false)}
          />

          <Modal
            title="Search Item by ID"
            open={isSearchModalVisible}
            onOk={handleSearch}
            onCancel={() => {
              setIsSearchModalVisible(false);
              setSearchId('');
            }}
          >
            <Input
              placeholder="Enter item ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              type="number"
              min={1}
            />
          </Modal>
        </Content>
      </Layout>
    </Provider>
  );
}

export default App;
