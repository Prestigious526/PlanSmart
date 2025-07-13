import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Divider, Spin } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import glossaryData from './Glossary_data.json';
import './GlossaryPage.css'; // Optional for extra styles

const { Title, Paragraph } = Typography;

const getYouTubeEmbedUrl = (url) => {
  const match = url.match(
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  );
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const GlossaryPage = () => {
  const [loading, setLoading] = useState(true);
  const [glossary, setGlossary] = useState([]);

  useEffect(() => {
    setGlossary(glossaryData);
    setLoading(false);
  }, []);

  return (
    <div className="glossary-container" style={{ padding: '2rem' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        📘 Financial Glossary
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        glossary.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '3rem' }}>
            <Title level={3} style={{ borderBottom: '2px solid #f0f0f0' }}>
              {section.title}
            </Title>
            <Row gutter={[24, 24]}>
              {section.terms.map((item, i) => (
                <Col key={i} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    title={item.term}
                    bordered
                    style={{ height: '100%' }}
                    cover={
                      <iframe
                        width="100%"
                        height="200"
                        src={getYouTubeEmbedUrl(item.videoLink)}
                        title={`Video for ${item.term}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    }
                  >
                    <Paragraph>{item.definition}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))
      )}
    </div>
  );
};

export default GlossaryPage;
