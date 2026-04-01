import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const Team = () => {
  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      bio: 'Hơn 10 năm kinh nghiệm trong lĩnh vực bán lẻ điện thoại di động.',
      image: '👨‍💼',
      social: ['linkedin', 'twitter', 'mail']
    },
    {
      name: 'Trần Thị B',
      role: 'CTO & Co-founder',
      bio: 'Chuyên gia công nghệ với nền tảng phát triển web và mobile mạnh mẽ.',
      image: '👩‍💻',
      social: ['linkedin', 'twitter', 'mail']
    },
    {
      name: 'Lê Văn C',
      role: 'Head of Operations',
      bio: 'Quản lý hoạt động kinh doanh, logistics và dịch vụ khách hàng.',
      image: '👨‍💼',
      social: ['linkedin', 'twitter', 'mail']
    },
    {
      name: 'Phạm Thị D',
      role: 'Head of Marketing',
      bio: 'Phát triển chiến lược tiếp thị kỹ thuật số và xây dựng thương hiệu.',
      image: '👩‍💼',
      social: ['linkedin', 'twitter', 'mail']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-surface-container-low to-background">
      <div className="max-w-screen-2xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Đội Ngũ Chúng Tôi
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Những chuyên gia giàu kinh nghiệm, tận tâm xây dựng nền tảng tốt nhất cho khách hàng.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-full aspect-square bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center text-6xl"
                >
                  {member.image}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4"
                >
                  {member.social.map((social, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 bg-white/20 border border-white/30 rounded-full hover:bg-white/30 transition-all"
                    >
                      {social === 'linkedin' && <Linkedin size={20} className="text-white" />}
                      {social === 'twitter' && <Twitter size={20} className="text-white" />}
                      {social === 'mail' && <Mail size={20} className="text-white" />}
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
                {member.name}
              </h3>
              <p className="text-primary font-semibold text-sm mb-2">
                {member.role}
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
