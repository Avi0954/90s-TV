require('dotenv').config();
const mongoose = require('mongoose');
const Channel = require('./models/Channel');
const Show = require('./models/Show');
const { convertToEmbedUrl } = require('./utils/youtubeHelper');
const data = require('./data/cartoonsData.json');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // CRITICAL: We no longer deleteMany() categories or shows to preserve user data.
        // Instead, we will upsert the starter data.

        // 1. Seed/Update Channels
        const channelMap = {};
        for (const ch of data.channels) {
            const updatedChannel = await Channel.findOneAndUpdate(
                { slug: ch.slug },
                {
                    name: ch.name,
                    description: ch.tagline || ch.description,
                    logo: ch.logo,
                    themeColor: ch.color || ch.themeColor,
                    accentColor: ch.accent || ch.accentColor,
                    type: ch.type || 'Cartoon',
                    isActive: true
                },
                { upsert: true, new: true }
            );
            channelMap[ch.slug] = updatedChannel._id;
            console.log(`- Synced Channel: ${ch.name}`);
        }

        // 2. Seed/Update Shows
        let seededCount = 0;
        for (const show of data.cartoons) {
            const channelId = channelMap[show.channelId];
            if (!channelId) continue;

            const category = ['episode', 'movie', 'song', 'special'].includes(show.category)
                ? show.category
                : 'episode';

            await Show.findOneAndUpdate(
                { slug: show.id },
                {
                    title: show.title,
                    thumbnail: show.thumbnail,
                    era: show.era,
                    genre: show.genre,
                    videoUrl: convertToEmbedUrl(show.videoUrl),
                    description: show.description,
                    isFeatured: show.featured || false,
                    channel: channelId,
                    franchise: show.franchise || '',
                    category: category,
                    isActive: true
                },
                { upsert: true }
            );
            seededCount++;
        }

        console.log(`Successfully synced ${data.channels.length} channels and ${seededCount} shows.`);
        console.log('Database Sync Complete! 📺✨ (User data preserved)');
        process.exit();
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

seedDatabase();
