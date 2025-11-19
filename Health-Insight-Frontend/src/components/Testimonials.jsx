import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      text: "HealthInsight helped me identify the right allergy medication when I was suffering from seasonal allergies. The interaction checker prevented me from taking something that would have reacted with my blood pressure meds.",
      name: "Sarah J.",
      location: "New York, NY",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg"
    },
    {
      text: "As a busy mom, I don't always have time to visit the doctor for minor ailments. HealthInsight gives me peace of mind that I'm choosing safe medications for my family.",
      name: "Maria G.",
      location: "Chicago, IL",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      text: "The detailed information about each medication helped me have more informed conversations with my doctor about treatment options for my chronic condition.",
      name: "Robert T.",
      location: "Houston, TX",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <div className="section-title">
        <h2>What Our Users Say</h2>
        <p>Thousands of people trust HealthInsight for their medication information needs</p>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-text">
              {testimonial.text}
            </div>
            <div className="testimonial-author">
              <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
              <div className="author-info">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;