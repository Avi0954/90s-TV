export const categories = [
    {
        id: 'action',
        name: 'Action Cartoons',
        subtitle: 'High energy & fights',
        number: '01',
        thumbnail: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'comedy',
        name: 'Comedy Cartoons',
        subtitle: 'Laugh & fun',
        number: '02',
        thumbnail: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'anime',
        name: 'Anime Specials',
        subtitle: 'Epic sagas & styles',
        number: '03',
        thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=400&auto=format&fit=crop'
    }
];

export const mainChannels = [
    {
        id: 'cn',
        name: 'Cartoon Network',
        type: 'Main',
        color: '#FFFF00',
        accent: 'yellow',
        tagline: 'Check It!',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Cartoon_Network_1992_logo.svg'
    },
    {
        id: 'nick',
        name: 'Nickelodeon',
        type: 'Main',
        color: '#FF6600',
        accent: 'orange',
        tagline: 'Nick, Nick, Nick!',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Nickelodeon_Splat_Logo.svg'
    },
    {
        id: 'disney',
        name: 'Disney Channel',
        type: 'Main',
        color: '#0099FF',
        accent: 'blue',
        tagline: 'The Place for You',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Disney_Channel_logo_2002.svg'
    },
    {
        id: 'jetix',
        name: 'Jetix',
        type: 'Main',
        color: '#FF0000',
        accent: 'red',
        tagline: "Don't Stop the Action",
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Jetix_logo.svg'
    },
    {
        id: 'animax',
        name: 'Animax',
        type: 'Main',
        color: '#660099',
        accent: 'purple',
        tagline: 'Anime for Everyone',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Animax_logo.svg'
    },
    {
        id: 'sonic',
        name: 'Nickelodeon Sonic',
        type: 'Main',
        color: '#FF3300',
        accent: 'yellow',
        tagline: 'Action and Adventure',
        logo: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Nickelodeon_Sonic_logo.png'
    }
];

export const optionalChannels = [
    {
        id: 'boomerang',
        name: 'Boomerang',
        type: 'Optional',
        color: '#00FFFF',
        accent: 'cyan',
        tagline: "It's All Coming Back To You",
        logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Boomerang_2004_logo.svg'
    },
    {
        id: 'toonami',
        name: 'Toonami',
        type: 'Optional',
        color: '#FF0000',
        accent: 'white',
        tagline: 'The Revolution Will Be Televised',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Toonami_logo.svg'
    }
];

export const cartoons = [
    // --- CARTOON NETWORK ---
    {
        id: 'cn-t-j',
        title: 'Tom and Jerry',
        channelId: 'cn',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/kP9TfCWnhIA/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/kP9TfCWnhIA',
        featured: true,
        description: 'The legendary cat and mouse duo in their classic chase comedy.'
    },
    {
        id: 'cn-dex',
        title: "Dexter's Laboratory",
        channelId: 'cn',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/XpI892C8M7g/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/XpI892C8M7g',
        featured: false,
        description: 'A boy genius tries to keep his secret laboratory safe from his meddling sister.'
    },
    {
        id: 'cn-ppg',
        title: 'Powerpuff Girls',
        channelId: 'cn',
        era: '90s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/q_M_Y6_P3zM/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/q_M_Y6_P3zM',
        featured: false,
        description: 'Three superpowered little girls fight crime in Townsville.'
    },
    {
        id: 'cn-jb',
        title: 'Johnny Bravo',
        channelId: 'cn',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/Exe0IEBNe9E/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/Exe0IEBNe9E',
        featured: false,
        description: 'A muscular young man tries to get women to date him, usually failing.'
    },
    {
        id: 'cn-ccy',
        title: 'Courage the Cowardly Dog',
        channelId: 'cn',
        era: '2000s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/7vS7B9_mYSw/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/7vS7B9_mYSw',
        featured: false,
        description: 'A pink dog defends his elderly owners from paranormal threats.'
    },
    {
        id: 'cn-b10',
        title: 'Ben 10',
        channelId: 'cn',
        era: '2000s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/Vv5oF9A0W-c/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/Vv5oF9A0W-c',
        featured: false,
        description: 'A boy finds a mysterious watch that allows him to transform into aliens.'
    },

    // --- NICKELODEON ---
    {
        id: 'nick-sb',
        title: 'SpongeBob SquarePants',
        channelId: 'nick',
        era: '2000s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/a2CwW61uE_w/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/a2CwW61uE_w',
        featured: true,
        description: 'The misadventures of a sea sponge living in an underwater city.'
    },
    {
        id: 'nick-nh',
        title: 'Ninja Hattori',
        channelId: 'nick',
        era: '2000s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/909E96pY7wM/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/909E96pY7wM',
        featured: false,
        description: 'A ninja from the Iga clan becomes friends with a young boy.'
    },
    {
        id: 'nick-dr',
        title: 'Doraemon',
        channelId: 'nick',
        era: '2000s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/X_z88DkX4K4/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/X_z88DkX4K4',
        featured: false,
        description: 'A robotic cat from the future helps a young boy with various gadgets.'
    },
    {
        id: 'nick-og',
        title: 'Oggy and the Cockroaches',
        channelId: 'nick',
        era: '2010s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/u-t-A0T0N_4/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/u-t-A0T0N_4',
        featured: false,
        description: 'A lazy cat is constantly tormented by three troublesome cockroaches.'
    },
    {
        id: 'nick-fop',
        title: 'Fairly OddParents',
        channelId: 'nick',
        era: '2000s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/YlMvI-Xp8mY/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/YlMvI-Xp8mY',
        featured: false,
        description: 'A boy is assigned two fairy godparents who grant his every wish.'
    },

    // --- DISNEY CHANNEL ---
    {
        id: 'dis-rec',
        title: 'Recess',
        channelId: 'disney',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/k6z-D9iF-Xo/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/k6z-D9iF-Xo',
        featured: false,
        description: 'A group of fourth-graders protects their playground from strict rules.'
    },
    {
        id: 'dis-dt',
        title: 'DuckTales',
        channelId: 'disney',
        era: '2000s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/BfL3f-zE3lM/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/BfL3f-zE3lM',
        featured: false,
        description: 'Scrooge McDuck and his nephews go on grand treasure-hunting adventures.'
    },
    {
        id: 'dis-pf',
        title: 'Phineas and Ferb',
        channelId: 'disney',
        era: '2010s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/u4_nS3V7vXk/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/u4_nS3V7vXk',
        featured: false,
        description: 'Two stepbrothers build elaborate inventions during their summer vacation.'
    },
    {
        id: 'dis-kp',
        title: 'Kim Possible',
        channelId: 'disney',
        era: '2000s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/P33p28K3M90/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/P33p28K3M90',
        featured: false,
        description: 'A teenage girl fights crime while balancing high school life.'
    },
    {
        id: 'dis-hh',
        title: 'Horrid Henry',
        channelId: 'disney',
        era: '2010s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/oPvq-3sBWAo/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/oPvq-3sBWAo',
        featured: false,
        description: 'The mischievous misadventures of a young boy named Henry.'
    },

    // --- JETIX ---
    {
        id: 'jex-pr',
        title: 'Power Rangers',
        channelId: 'jetix',
        era: '2000s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/8m6i_RjPzI8/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/8m6i_RjPzI8',
        featured: false,
        description: 'A group of teenagers with superpowers protects Earth from evil.'
    },
    {
        id: 'jex-dig',
        title: 'Digimon',
        channelId: 'jetix',
        era: '90s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/vS8un8q33y0/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/vS8un8q33y0',
        featured: false,
        description: 'Children transported to a digital world bond with digital monsters.'
    },
    {
        id: 'jex-bey',
        title: 'Beyblade',
        channelId: 'jetix',
        era: '2000s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/N6vC1oPcl8U/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/N6vC1oPcl8U',
        featured: false,
        description: 'Competitors use high-tech spinning tops to battle in stadiums.'
    },
    {
        id: 'jex-jca',
        title: 'Jackie Chan Adventures',
        channelId: 'jetix',
        era: '2000s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/Q2E83_O-f9w/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/Q2E83_O-f9w',
        featured: false,
        description: 'A fictional version of Jackie Chan hunts for magical talismans.'
    },

    // --- ANIMAX ---
    {
        id: 'anx-dbz',
        title: 'Dragon Ball Z',
        channelId: 'animax',
        era: '90s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/3vXp8bHhXh4/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/3vXp8bHhXh4',
        featured: true,
        description: 'Goku and his friends defend Earth against powerful celestial threats.'
    },
    {
        id: 'anx-nar',
        title: 'Naruto',
        channelId: 'animax',
        era: '2000s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/QczGoPeQ8S4/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/QczGoPeQ8S4',
        featured: true,
        description: 'A young ninja seeks recognition and dreams of becoming the village leader.'
    },
    {
        id: 'anx-blc',
        title: 'Bleach',
        channelId: 'animax',
        era: '2000s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/oZ67d9TzH5E/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/oZ67d9TzH5E',
        featured: false,
        description: 'A teenager with the ability to see ghosts becomes a Soul Reaper.'
    },
    {
        id: 'anx-dn',
        title: 'Death Note',
        channelId: 'animax',
        era: '2000s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/Nt0W3C-p2Is/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/Nt0W3C-p2Is',
        featured: false,
        description: 'A student discovers a notebook that can kill anyone whose name is written in it.'
    },
    {
        id: 'anx-opm',
        title: 'One Punch Man',
        channelId: 'animax',
        era: '2010s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/X_z88DkX4K4/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/X_z88DkX4K4',
        featured: false,
        description: 'A hero who can defeat any opponent with a single punch seeks a challenge.'
    },

    // --- SONIC ---
    {
        id: 'son-prs',
        title: 'Power Rangers Samurai',
        channelId: 'sonic',
        era: '2010s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/XpI892C8M7g/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/XpI892C8M7g',
        featured: false,
        description: 'A new generation of Power Rangers uses samurai skills to fight evil.'
    },
    {
        id: 'son-slu',
        title: 'Slugterra',
        channelId: 'sonic',
        era: '2010s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/Vv5oF9A0W-c/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/Vv5oF9A0W-c',
        featured: false,
        description: 'A teenager uses magical slugs as weapons in an underground world.'
    },
    {
        id: 'son-sn',
        title: 'Supah Ninjas',
        channelId: 'sonic',
        era: '2010s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/Exe0IEBNe9E/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/Exe0IEBNe9E',
        featured: false,
        description: 'Three high schoolers form a secret ninja team to fight crime.'
    },
    {
        id: 'son-tmnt',
        title: 'Teenage Mutant Ninja Turtles',
        channelId: 'sonic',
        era: '2010s',
        genre: 'Action',
        category: 'action',
        thumbnail: 'https://img.youtube.com/vi/a2CwW61uE_w/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/a2CwW61uE_w',
        featured: false,
        description: 'Four turtle brothers trained in ninjutsu protect New York City.'
    },

    // --- BOOMERANG ---
    {
        id: 'boo-sd',
        title: 'Scooby-Doo',
        channelId: 'boomerang',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/YlMvI-Xp8mY/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/YlMvI-Xp8mY',
        featured: false,
        description: 'A group of teenagers and their dog solve spooky mysteries.'
    },
    {
        id: 'boo-flt',
        title: 'The Flintstones',
        channelId: 'boomerang',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/kP9TfCWnhIA/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/kP9TfCWnhIA',
        featured: false,
        description: 'The misadventures of a modern Stone Age family.'
    },
    {
        id: 'boo-jet',
        title: 'The Jetsons',
        channelId: 'boomerang',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/XpI892C8M7g/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/XpI892C8M7g',
        featured: false,
        description: 'The misadventures of a futuristic family living in the space age.'
    },
    {
        id: 'boo-wr',
        title: 'Wacky Races',
        channelId: 'boomerang',
        era: '90s',
        genre: 'Comedy',
        category: 'comedy',
        thumbnail: 'https://img.youtube.com/vi/q_M_Y6_P3zM/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/q_M_Y6_P3zM',
        featured: false,
        description: 'Strange and colorful characters compete in a crazy cross-country road race.'
    },

    // --- TOONAMI ---
    {
        id: 'too-dbz',
        title: 'Dragon Ball Z',
        channelId: 'toonami',
        era: '90s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/3vXp8bHhXh4/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/3vXp8bHhXh4',
        featured: false,
        description: 'The intense action-packed saga of Goku and the Z-Fighters.'
    },
    {
        id: 'too-gw',
        title: 'Gundam Wing',
        channelId: 'toonami',
        era: '90s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/Exe0IEBNe9E/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/Exe0IEBNe9E',
        featured: false,
        description: 'Five pilots use giant mechs to fight for space colony independence.'
    },
    {
        id: 'too-yyh',
        title: 'Yu Yu Hakusho',
        channelId: 'toonami',
        era: '90s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/7vS7B9_mYSw/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/7vS7B9_mYSw',
        featured: false,
        description: 'A delinquent becomes a spirit detective after a fateful sacrifice.'
    },
    {
        id: 'too-nar',
        title: 'Naruto',
        channelId: 'toonami',
        era: '2000s',
        genre: 'Anime',
        category: 'anime',
        thumbnail: 'https://img.youtube.com/vi/QczGoPeQ8S4/0.jpg',
        videoUrl: 'https://www.youtube.com/embed/QczGoPeQ8S4',
        featured: false,
        description: "A young ninja's quest to become the greatest in his village."
    }
];
