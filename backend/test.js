import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

let authToken = '';
let storyId = '';

// Test Register
const testRegister = async () => {
    try {
        console.log('\n📝 Testing Register...');
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            username: 'storytester',
            email: `storytester${Date.now()}@example.com`,
            password: 'password123'
        });
        authToken = response.data.token;
        console.log('✓ Register Success');
        console.log('Token:', authToken.substring(0, 20) + '...');
        return response.data;
    } catch (error) {
        console.error('✗ Register Error:', error.response?.data || error.message);
        return null;
    }
};

// Test Create Story
const testCreateStory = async () => {
    try {
        console.log('\n✍️ Testing Create Story...');
        const response = await api.post('/stories', 
            {
                title: 'My Amazing Adventure',
                content: 'Once upon a time, there was an amazing adventure that changed everything. This story is about discovery, growth, and transformation. It spans many words to test the read time calculation properly.',
                description: 'An incredible tale of adventure and discovery',
                tags: ['adventure', 'fiction', 'inspiring']
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        storyId = response.data._id;
        console.log('✓ Story Created Successfully');
        console.log('Story ID:', storyId);
        console.log('Title:', response.data.title);
        console.log('Read Time:', response.data.readTime, 'min');
        return response.data;
    } catch (error) {
        console.error('✗ Create Story Error:', error.response?.data || error.message);
        return null;
    }
};

// Test Read All Stories
const testReadAllStories = async () => {
    try {
        console.log('\n📚 Testing Read All Stories...');
        const response = await api.get('/stories');
        console.log('✓ Stories Retrieved Successfully');
        console.log('Total Stories:', response.data.length);
        if (response.data.length > 0) {
            console.log('First Story:', response.data[0].title);
        }
        return response.data;
    } catch (error) {
        console.error('✗ Read All Stories Error:', error.response?.data || error.message);
        return null;
    }
};

// Test Read Single Story
const testReadStory = async () => {
    if (!storyId) {
        console.log('⚠️ Skipping Read Story - no story ID available');
        return null;
    }
    try {
        console.log('\n📖 Testing Read Single Story...');
        const response = await api.get(`/stories/${storyId}`);
        console.log('✓ Story Retrieved Successfully');
        console.log('Title:', response.data.title);
        console.log('Views:', response.data.views);
        console.log('Likes:', response.data.likes.length);
        return response.data;
    } catch (error) {
        console.error('✗ Read Story Error:', error.response?.data || error.message);
        return null;
    }
};

// Test Update Story
const testUpdateStory = async () => {
    if (!storyId) {
        console.log('⚠️ Skipping Update Story - no story ID available');
        return null;
    }
    try {
        console.log('\n🔄 Testing Update Story...');
        const response = await api.put(`/stories/${storyId}`,
            {
                title: 'My Amazing Adventure - Updated',
                description: 'Updated description with more details',
                tags: ['adventure', 'fiction', 'inspiring', 'updated']
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log('✓ Story Updated Successfully');
        console.log('New Title:', response.data.title);
        return response.data;
    } catch (error) {
        console.error('✗ Update Story Error:', error.response?.data || error.message);
        return null;
    }
};

// Test Like Story
const testLikeStory = async () => {
    if (!storyId) {
        console.log('⚠️ Skipping Like Story - no story ID available');
        return null;
    }
    try {
        console.log('\n❤️ Testing Like Story...');
        const response = await api.post(`/stories/${storyId}/like`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log('✓ Story Liked Successfully');
        console.log('Total Likes:', response.data.likes.length);
        return response.data;
    } catch (error) {
        console.error('✗ Like Story Error:', error.response?.data || error.message);
        return null;
    }
};

// Test Get User Stories
const testGetUserStories = async () => {
    try {
        console.log('\n👤 Testing Get User Stories...');
        const response = await api.get('/stories/user/stories',
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log('✓ User Stories Retrieved Successfully');
        console.log('User Story Count:', response.data.length);
        return response.data;
    } catch (error) {
        console.error('✗ Get User Stories Error:', error.response?.data || error.message);
        return null;
    }
};

// Test Delete Story
const testDeleteStory = async () => {
    if (!storyId) {
        console.log('⚠️ Skipping Delete Story - no story ID available');
        return null;
    }
    try {
        console.log('\n🗑️ Testing Delete Story...');
        const response = await api.delete(`/stories/${storyId}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        console.log('✓ Story Deleted Successfully');
        console.log('Deleted Story ID:', response.data.id);
        return response.data;
    } catch (error) {
        console.error('✗ Delete Story Error:', error.response?.data || error.message);
        return null;
    }
};

// Run all tests
(async () => {
    console.log('='.repeat(50));
    console.log('🧪 STORY CRUD API TEST SUITE');
    console.log('='.repeat(50));

    await testRegister();
    await testCreateStory();
    await testReadAllStories();
    await testReadStory();
    await testUpdateStory();
    await testLikeStory();
    await testGetUserStories();
    await testDeleteStory();

    console.log('\n' + '='.repeat(50));
    console.log('✓ All tests completed!');
    console.log('='.repeat(50));
    process.exit(0);
})();
