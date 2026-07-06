import React from 'react';

interface TaskItem {
  time: string;
  task: string;
}

interface TodayProps {
  tasks?: TaskItem[];
}

export const Today: React.FC<TodayProps> = ({ tasks }) => {
  const defaultTasks: TaskItem[] = [
    { time: '09:00', task: 'Demo with Tawana' },
    { time: '11:30', task: 'Follow-up with Natural Forte' },
    { time: '14:00', task: 'Proposal pending for Glow Med Spa' },
    { time: '16:30', task: 'Call Review with Team' }
  ];

  const activeTasks = tasks || defaultTasks;

  return (
    <section className="launch-section">
      <h2 className="launch-section-heading">Today</h2>
      <div className="timeline-list">
        {activeTasks.map((item, index) => (
          <div key={index} className="timeline-item">
            <span className="timeline-time">{item.time}</span>
            <span className="timeline-task">{item.task}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Today;
