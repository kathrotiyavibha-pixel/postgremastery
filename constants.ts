
import { Course, SyllabusTopic, Testimonial, FaqItem, LevelQuiz, BlogPost } from './types';

export const COURSES: Course[] = [
  {
    id: 'l1',
    level: 'L1',
    title: 'PostgreSQL\nFoundation',
    price: 12000,
    description: 'Start your database journey with a solid foundation. Perfect for freshers and students.',
    duration: '48 Hours (1-2 Months)',
    targetAudience: 'Freshers, Students, Junior Developers',
    skills: ['SQL Basics', 'Installation & Config', 'Backup & Restore', 'User Management'],
    color: 'bg-blue-600',
    features: ['Live Interactive Sessions', 'Basic SQL Assignments', 'Certificate of Completion']
  },
  {
    id: 'l2',
    level: 'L2',
    title: 'PostgreSQL\nIntermediate',
    price: 15000,
    description: 'Master indexing, query optimization, and advanced SQL patterns.',
    duration: '60 Hours (1-2 Months)',
    targetAudience: 'Backend Developers, Data Analysts',
    skills: ['Indexing Strategies', 'Query Planning', 'Performance Tuning', 'Vacuum & Maintenance'],
    color: 'bg-indigo-600',
    features: ['Performance Workshops', 'Real-world Case Studies', 'Query Optimization Labs']
  },
  {
    id: 'l3',
    level: 'L3',
    title: 'PostgreSQL\nAdvanced',
    price: 20000,
    description: 'Deep dive into architecture, internals, replication, and high availability.',
    duration: '72 Hours (2-3 Months)',
    targetAudience: 'Senior Engineers, DBAs',
    skills: ['Architecture & Internals', 'Replication & HA', 'PITR Recovery', 'Connection Pooling'],
    color: 'bg-purple-600',
    features: ['Architecture Deep Dives', 'HA Setup Simulations', 'Disaster Recovery Drills']
  },
  {
    id: 'l4',
    level: 'L4',
    title: 'PostgreSQL\nExpert',
    price: 30000,
    description: 'The ultimate level for architects. Logical Replication, Oracle to PG Migration, and Query tuning.',
    duration: '86 Hours (3-4 Months)',
    targetAudience: 'Architects, Principal Engineers',
    skills: ['Oracle to PG Migration', 'Query Tuning', 'Logical Replication', 'Upgrades'],
    color: 'bg-red-600',
    features: ['Upgrades', 'Migration', 'One-on-One Mentorship']
  }
];

export const SYLLABUS: SyllabusTopic[] = [
  // L1 - Beginner
  {
    id: 1,
    title: 'What Is PostgreSQL?',
    description: 'Overview of the world\'s most advanced open-source object-relational database system.',
    level: 'Beginner'
  },
  {
    id: 2,
    title: 'A Brief History of PostgreSQL',
    description: 'From its origins at UC Berkeley to its current status as a community-driven powerhouse.',
    level: 'Beginner'
  },
  {
    id: 3,
    title: 'Installation from Binaries',
    description: 'Step-by-step guide to installing PostgreSQL using pre-compiled packages on Linux, Windows, and macOS.',
    level: 'Beginner'
  },
  {
    id: 4,
    title: 'Server Setup and Operation',
    description: 'Initializing the data directory, starting/stopping the server, and managing the backend process.',
    level: 'Beginner'
  },
  {
    id: 5,
    title: 'Managing Databases',
    description: 'Core concepts of creating, altering, and dropping databases, schemas, and tables.',
    level: 'Beginner'
  },
  // L2 - Intermediate
  {
    id: 6,
    title: 'Database Roles',
    description: 'Understanding role-based access control, users, groups, and privilege management.',
    level: 'Intermediate'
  },
  {
    id: 7,
    title: 'Client Authentication',
    description: 'Deep dive into pg_hba.conf, connection security, and authentication methods like SCRAM-SHA-256.',
    level: 'Intermediate'
  },
  {
    id: 8,
    title: 'Server Configuration',
    description: 'Tuning parameters in postgresql.conf for memory, disk, and connection optimization.',
    level: 'Intermediate'
  },
  {
    id: 9,
    title: 'Routine Database Maintenance Tasks',
    description: 'Managing table bloat, autovacuum tuning, and reindexing strategies for healthy performance.',
    level: 'Intermediate'
  },
  {
    id: 10,
    title: 'Backup and Restore',
    description: 'Mastering logical backups with pg_dump and physical backups with pg_basebackup.',
    level: 'Intermediate'
  },
  // L3 - Advanced
  {
    id: 11,
    title: 'Indexes',
    description: 'Comprehensive study of B-Tree, Hash, GIN, GiST, and BRIN index internals and use cases.',
    level: 'Advanced'
  },
  {
    id: 12,
    title: 'Monitoring Database Activity',
    description: 'Using pg_stat_activity, wait events, and logging to diagnose production performance issues.',
    level: 'Advanced'
  },
  {
    id: 13,
    title: 'Overview of PostgreSQL Internals',
    description: 'Memory architecture (shared buffers), process hierarchy, and the on-disk storage format.',
    level: 'Advanced'
  },
  {
    id: 14,
    title: 'System Catalogs',
    description: 'Exploring pg_catalog tables to understand how PostgreSQL stores metadata about objects.',
    level: 'Advanced'
  },
  {
    id: 15,
    title: 'System Views',
    description: 'Querying information_schema and administrative views to monitor server health.',
    level: 'Advanced'
  },
  {
    id: 16,
    title: 'Reliability and the Write-Ahead Log',
    description: 'Understanding WAL, checkpoints, and how Postgres ensures durability (ACID properties).',
    level: 'Advanced'
  },
  // L4 - Expert
  {
    id: 17,
    title: 'Localization',
    description: 'Managing collations, character sets, and multi-language support in global applications.',
    level: 'Expert'
  },
  {
    id: 18,
    title: 'High Availability, Load Balancing, and Replication',
    description: 'Setting up streaming replication, failover management with Patroni, and read-scaling.',
    level: 'Expert'
  },
  {
    id: 19,
    title: 'Logical Replication',
    description: 'Publish/Subscribe models for selective data replication and zero-downtime upgrades.',
    level: 'Expert'
  },
  {
    id: 20,
    title: 'Background Worker Processes',
    description: 'Developing custom C extensions that run as independent background tasks within the database.',
    level: 'Expert'
  },
  {
    id: 21,
    title: 'Installation from Source Code',
    description: 'Building custom PostgreSQL binaries with specific compile-time flags and extensions.',
    level: 'Expert'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Database Engineer',
    company: 'IOCL',
    content: 'Karthik sir explains concepts in very simple Hinglish. Even complex topics like MVCC became easy to understand.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Backend Dev',
    company: 'Mauli Infotech',
    content: 'I was struggling with query performance. The L2 course helped me optimize our production database significantly.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 3,
    name: 'Amit Singh',
    role: 'Senior DBA',
    company: '3i Infotech',
    content: 'Best course for internals. Usually courses only teach syntax, but this one goes deep into architecture.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    role: 'System Analyst',
    company: 'Uniserve',
    content: 'The 3D syllabus and visualization of concepts is amazing. It makes learning very interactive.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 5,
    name: 'Vikram Malhotra',
    role: 'Tech Lead',
    company: 'OutWorks',
    content: 'We trained our entire team using the L3 module. The HA and Replication sections are world-class.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 6,
    name: 'Ankit Verma',
    role: 'Fresher',
    company: 'College Passout',
    content: 'I got placed as a Junior DBA after completing L1 and L2. The interview questions section was very helpful.',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

export const FAQS: FaqItem[] = [
  {
    question: 'Do I need prior coding experience?',
    answer: 'For L1, no prior experience is required. For higher levels, basic SQL knowledge is recommended.'
  },
  {
    question: 'Is the certification recognized?',
    answer: 'Yes, our certificates are industry-recognized and valued by top tech companies hiring for database roles.'
  },
  {
    question: 'Can I access the course material after completion?',
    answer: 'Absolutely! You get lifetime access to all course materials, including recorded sessions and notes.'
  },
  {
    question: 'Do you offer placement assistance?',
    answer: 'We provide career guidance, resume reviews, and connect high-performing students with our hiring partners.'
  }
];

export const QUIZZES: LevelQuiz[] = [
  {
    level: 'L1',
    questions: [
      { id: 1, question: 'Which file controls client authentication?', options: ['postgresql.conf', 'pg_hba.conf', 'pg_ident.conf', 'postmaster.pid'], correctAnswer: 1 },
      { id: 2, question: 'What is the default superuser name?', options: ['admin', 'root', 'postgres', 'system'], correctAnswer: 2 },
      { id: 3, question: 'Command to list all databases in psql?', options: ['\\l', '\\d', '\\dt', '\\db'], correctAnswer: 0 },
      { id: 4, question: 'Which process handles background writes?', options: ['WAL Writer', 'Background Writer', 'Checkpointer', 'Autovacuum'], correctAnswer: 1 },
      { id: 5, question: 'Default location of data directory?', options: ['/var/lib/pgsql/data', '/usr/local/pgsql', '/etc/postgresql', '/opt/postgres'], correctAnswer: 0 }
    ]
  },
  {
    level: 'L2',
    questions: [
      { id: 1, question: 'Which index is best for text search?', options: ['B-Tree', 'Hash', 'GIN', 'BRIN'], correctAnswer: 2 },
      { id: 2, question: 'VACUUM FULL does what?', options: ['Reclaims space & locks table', 'Updates stats only', 'Cleans dead tuples non-blocking', 'Backups table'], correctAnswer: 0 },
      { id: 3, question: 'What does "Cost" mean in EXPLAIN?', options: ['Time in seconds', 'CPU/IO units', 'Money', 'Memory usage'], correctAnswer: 1 },
      { id: 4, question: 'Which join type is generally fastest?', options: ['Nested Loop', 'Hash Join', 'Merge Join', 'Cross Join'], correctAnswer: 1 },
      { id: 5, question: 'Parameter to adjust memory for sorts?', options: ['shared_buffers', 'work_mem', 'maintenance_work_mem', 'effective_cache_size'], correctAnswer: 1 }
    ]
  },
  {
    level: 'L3',
    questions: [
      { id: 1, question: 'What triggers a checkpoint?', options: ['max_wal_size reached', 'checkpoint_timeout', 'Manual command', 'All of the above'], correctAnswer: 3 },
      { id: 2, question: 'Isolation level preventing Phantom Reads?', options: ['Read Committed', 'Repeatable Read', 'Serializable', 'Read Uncommitted'], correctAnswer: 2 },
      { id: 3, question: 'Split Brain occurs in?', options: ['Single Node', 'HA Clusters', 'Read Replicas', 'Backup'], correctAnswer: 1 },
      { id: 4, question: 'Patroni uses which consensus store?', options: ['Redis', 'Etcd/Consul', 'Memcached', 'Postgres itself'], correctAnswer: 1 }, 
      { id: 5, question: 'Logical Replication allows?', options: ['DDL Replication', 'Selective Table Replication', 'Full Instance Copy', 'WAL Archiving'], correctAnswer: 1 }
    ]
  },
  {
    level: 'L4',
    questions: [
      { id: 1, question: 'Which C structure holds row data?', options: ['HeapTupleHeader', 'PageHeader', 'BufferTag', 'ItemPointer'], correctAnswer: 0 },
      { id: 2, question: 'Dirty pages are flushed by?', options: ['Background Writer', 'Checkpointer', 'Backend Process', 'All of the above'], correctAnswer: 3 },
      { id: 3, question: 'Huge Pages help in?', options: ['Reducing TLB misses', 'Increasing Disk I/O', 'Reducing WAL size', 'Faster Sorting'], correctAnswer: 0 },
      { id: 4, question: 'Max Transaction ID in Postgres?', options: ['2 Billion', '4 Billion', '8 Billion', 'Unlimited'], correctAnswer: 1 },
      { id: 5, question: 'Custom Background Workers are started by?', options: ['Postmaster', 'Client Connection', 'PgBouncer', 'OS'], correctAnswer: 0 }
    ]
  }
];

const BLOG_TOPICS = [
  // L1 Topics
  { t: 'Installing PostgreSQL on Linux', c: 'Tutorial', l: 'L1' },
  { t: 'Understanding pg_hba.conf', c: 'Security', l: 'L1' },
  { t: 'Basic SQL Commands Cheat Sheet', c: 'General', l: 'L1' },
  { t: 'Data Types Explained', c: 'General', l: 'L1' },
  { t: 'Backup and Restore with pg_dump', c: 'Operations', l: 'L1' },
  { t: 'Creating Users and Roles', c: 'Security', l: 'L1' },
  { t: 'PostgreSQL vs MySQL: An Architectural View', c: 'Architecture', l: 'L1' },
  { t: 'Introduction to psql CLI', c: 'Tools', l: 'L1' },
  { t: 'Understanding Schemas', c: 'General', l: 'L1' },
  { t: 'Primary Keys vs Unique Constraints', c: 'General', l: 'L1' },
  { t: 'Foreign Keys and Referential Integrity', c: 'General', l: 'L1' },
  { t: 'Installing pgAdmin 4', c: 'Tools', l: 'L1' },
  { t: 'How to Upgrade PostgreSQL (Minor Version)', c: 'Operations', l: 'L1' },
  { t: 'Understanding Tablespaces', c: 'Architecture', l: 'L1' },
  { t: 'Views vs Materialized Views', c: 'General', l: 'L1' },
  { t: 'Using COPY command for Bulk Load', c: 'Performance', l: 'L1' },
  { t: 'Understanding NULLs in SQL', c: 'General', l: 'L1' },
  { t: 'String Functions in PostgreSQL', c: 'General', l: 'L1' },
  { t: 'Date and Time Functions', c: 'General', l: 'L1' },
  { t: 'Connecting via JDBC/ODBC', c: 'DevOps', l: 'L1' },
  { t: 'PostgreSQL Directory Structure', c: 'Architecture', l: 'L1' },
  { t: 'Starting and Stopping Postgres Service', c: 'Operations', l: 'L1' },
  { t: 'Log File Management Basics', c: 'Operations', l: 'L1' },
  { t: 'Intro to JSON Data Type', c: 'General', l: 'L1' },
  { t: 'Using Sequences and Serial', c: 'General', l: 'L1' },

  // L2 Topics
  { t: 'B-Tree Index Internals', c: 'Performance', l: 'L2' },
  { t: 'Understanding EXPLAIN ANALYZE', c: 'Performance', l: 'L2' },
  { t: 'Hash Joins vs Nested Loops', c: 'Performance', l: 'L2' },
  { t: 'Optimizing ORDER BY clauses', c: 'Performance', l: 'L2' },
  { t: 'Introduction to Autovacuum', c: 'Operations', l: 'L2' },
  { t: 'Table Bloat: Detection and Fixes', c: 'Operations', l: 'L2' },
  { t: 'GIN Indexing for JSONB', c: 'Performance', l: 'L2' },
  { t: 'Partial Indexes for Speed', c: 'Performance', l: 'L2' },
  { t: 'Covering Indexes (Index Only Scans)', c: 'Performance', l: 'L2' },
  { t: 'Partitioning Strategies', c: 'Architecture', l: 'L2' },
  { t: 'Understanding shared_buffers', c: 'Performance', l: 'L2' },
  { t: 'Tuning work_mem for Sorts', c: 'Performance', l: 'L2' },
  { t: 'Effective Cache Size Explained', c: 'Performance', l: 'L2' },
  { t: 'Parallel Query Execution', c: 'Performance', l: 'L2' },
  { t: 'Monitoring with pg_stat_activity', c: 'Operations', l: 'L2' },
  { t: 'Detecting Slow Queries', c: 'Operations', l: 'L2' },
  { t: 'Understanding Lock Modes', c: 'Architecture', l: 'L2' },
  { t: 'Blocking and Deadlocks', c: 'Architecture', l: 'L2' },
  { t: 'CTE (Common Table Expressions) Performance', c: 'Performance', l: 'L2' },
  { t: 'Window Functions Deep Dive', c: 'General', l: 'L2' },
  { t: 'Full Text Search in Postgres', c: 'General', l: 'L2' },
  { t: 'BRIN Indexes for Big Data', c: 'Performance', l: 'L2' },
  { t: 'UUIDs vs Integers for PK', c: 'Architecture', l: 'L2' },
  { t: 'PostGIS Basics', c: 'General', l: 'L2' },
  { t: 'Using pg_repack', c: 'Operations', l: 'L2' },

  // L3 Topics
  { t: 'MVCC Deep Dive', c: 'Architecture', l: 'L3' },
  { t: 'WAL (Write Ahead Logging) Explained', c: 'Architecture', l: 'L3' },
  { t: 'Checkpoint Tuning', c: 'Performance', l: 'L3' },
  { t: 'Setting up Streaming Replication', c: 'Architecture', l: 'L3' },
  { t: 'Logical Replication Internals', c: 'Architecture', l: 'L3' },
  { t: 'PgBouncer Connection Pooling', c: 'Architecture', l: 'L3' },
  { t: 'High Availability with Patroni', c: 'Architecture', l: 'L3' },
  { t: 'Disaster Recovery with PITR', c: 'Operations', l: 'L3' },
  { t: 'Transaction Isolation Levels', c: 'Architecture', l: 'L3' },
  { t: 'Preventing Wraparound Issues', c: 'Operations', l: 'L3' },
  { t: 'Heap Only Tuples (HOT) Optimization', c: 'Performance', l: 'L3' },
  { t: 'Buffer Cache Internals', c: 'Architecture', l: 'L3' },
  { t: 'Background Writer vs Checkpointer', c: 'Architecture', l: 'L3' },
  { t: 'Synchronous vs Asynchronous Commit', c: 'Performance', l: 'L3' },
  { t: 'Managing Bloat in High Write Systems', c: 'Operations', l: 'L3' },
  { t: 'Using pg_stat_statements', c: 'Performance', l: 'L3' },
  { t: 'Security: SSL/TLS Setup', c: 'Security', l: 'L3' },
  { t: 'Row Level Security (RLS)', c: 'Security', l: 'L3' },
  { t: 'Declarative Partitioning details', c: 'Architecture', l: 'L3' },
  { t: 'Foreign Data Wrappers (FDW)', c: 'Architecture', l: 'L3' },
  { t: 'Upgrade Strategies (pg_upgrade)', c: 'Operations', l: 'L3' },
  { t: 'Monitoring with Prometheus/Grafana', c: 'DevOps', l: 'L3' },
  { t: 'Containerizing Postgres (Docker)', c: 'DevOps', l: 'L3' },
  { t: 'Postgres on Kubernetes (CloudNativePG)', c: 'DevOps', l: 'L3' },
  { t: 'Anatomy of a Page Header', c: 'Architecture', l: 'L3' },

  // L4 Topics
  { t: 'PostgreSQL Source Code Overview', c: 'Architecture', l: 'L4' },
  { t: 'Writing C Extensions', c: 'Architecture', l: 'L4' },
  { t: 'Kernel Tuning (Huge Pages, NUMA)', c: 'Performance', l: 'L4' },
  { t: 'Custom Background Workers', c: 'Architecture', l: 'L4' },
  { t: 'Pluggable Storage Engines (Table AM)', c: 'Architecture', l: 'L4' },
  { t: 'Hook System in PostgreSQL', c: 'Architecture', l: 'L4' },
  { t: 'Advanced WAL compression', c: 'Performance', l: 'L4' },
  { t: 'Wait Events Analysis', c: 'Performance', l: 'L4' },
  { t: 'Debugging with gdb', c: 'DevOps', l: 'L4' },
  { t: 'Patching PostgreSQL Source', c: 'Architecture', l: 'L4' },
  { t: 'Understanding Spinlocks and LWLocks', c: 'Architecture', l: 'L4' },
  { t: 'Custom Aggregates and Window Functions', c: 'Architecture', l: 'L4' },
  { t: 'JIT Compilation in Postgres', c: 'Performance', l: 'L4' },
  { t: 'Logical Decoding Plugins', c: 'Architecture', l: 'L4' },
  { t: 'Zero Downtime Major Upgrades', c: 'Operations', l: 'L4' },
  { t: 'Multi-Master Replication Conflicts', c: 'Architecture', l: 'L4' },
  { t: 'Sharding with Citus', c: 'Architecture', l: 'L4' },
  { t: 'Index Access Method Interface', c: 'Architecture', l: 'L4' },
  { t: 'Data Corruption Forensics', c: 'Operations', l: 'L4' },
  { t: 'Benchmarking with pgbench', c: 'Performance', l: 'L4' },
  { t: 'Advanced Memory Management', c: 'Performance', l: 'L4' },
  { t: 'Postgres Protocols (Wire Protocol)', c: 'Architecture', l: 'L4' },
  { t: 'Contributing to Community', c: 'General', l: 'L4' },
  { t: 'Future of PostgreSQL', c: 'General', l: 'L4' },
  { t: 'Case Study: Migrating Oracle to PG', c: 'Architecture', l: 'L4' },
];

// Helper to generate raw blog data with dates first, so we can sort them and assign IDs correctly.
const generateRawBlogs = () => {
  const blogs = [];
  const TOTAL_BLOGS = 100;

  for (let i = 0; i < TOTAL_BLOGS; i++) {
    const topic = BLOG_TOPICS[i % BLOG_TOPICS.length];
    
    // Random date within last ~3 years
    const randomTime = Date.now() - Math.floor(Math.random() * 10000000000); 
    const dateObj = new Date(randomTime);

    // Custom Content Logic
    let content = `<p>This is a detailed article about ${topic.t}. In this post, we cover the fundamentals and deep dive into the specifics of ${topic.c.toLowerCase()}.</p>
    <p>PostgreSQL continues to be the most advanced open source database. Understanding ${topic.t} is crucial for any DBA.</p>
    <h3>Key Concepts</h3>
    <ul>
      <li>Concept 1: Core functionality</li>
      <li>Concept 2: Performance implications</li>
      <li>Concept 3: Best practices</li>
    </ul>`;

    if (topic.t === 'PostgreSQL vs MySQL: An Architectural View') {
      content = `
      <p>Choosing between PostgreSQL and MySQL is a common dilemma. Here is a detailed architectural comparison.</p>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>PostgreSQL</th>
            <th>MySQL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Architecture</strong></td>
            <td>Process-based (Robust, isolate crashes)</td>
            <td>Thread-based (Lightweight context switch)</td>
          </tr>
          <tr>
            <td><strong>Join Algorithms</strong></td>
            <td>Nested Loop, Hash Join, Merge Join</td>
            <td>Nested Loop, Hash Join (Newer versions)</td>
          </tr>
          <tr>
            <td><strong>License</strong></td>
            <td>PostgreSQL License (Very permissive)</td>
            <td>GPL (More restrictive)</td>
          </tr>
          <tr>
            <td><strong>Replication</strong></td>
            <td>Streaming (Physical) & Logical</td>
            <td>Binlog (Logical)</td>
          </tr>
          <tr>
            <td><strong>Concurrency</strong></td>
            <td>MVCC with no Read Locks</td>
            <td>MVCC (InnoDB) with Undo Logs</td>
          </tr>
        </tbody>
      </table>
      <p>While MySQL is excellent for web workloads, PostgreSQL shines in complex queries, data integrity, and extensibility.</p>
      `;
    }

    blogs.push({
      tempDate: dateObj,
      title: topic.t,
      excerpt: `Learn everything about ${topic.t}. A comprehensive guide for ${topic.l} engineers.`,
      content: content,
      author: 'Karthik Katrotiya',
      readTime: `${Math.floor(Math.random() * 10) + 5} min read`,
      category: topic.c,
      tags: ['PostgreSQL', topic.c, 'Database'],
      level: topic.l
    });
  }

  // SORT BY DATE ASCENDING (Oldest First)
  // This ensures ID 1 is the oldest date, and ID 100 is the newest date.
  blogs.sort((a, b) => a.tempDate.getTime() - b.tempDate.getTime());

  return blogs;
};

// Generate and Map to Final Structure
const sortedRawBlogs = generateRawBlogs();

export const INITIAL_BLOGS: BlogPost[] = sortedRawBlogs.map((blog, idx) => ({
  id: (idx + 1).toString(), // ID 1 = Oldest, ID 100 = Newest
  title: blog.title,
  excerpt: blog.excerpt,
  content: blog.content,
  author: blog.author,
  date: blog.tempDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  readTime: blog.readTime,
  category: blog.category,
  tags: blog.tags,
  level: blog.level
}));
