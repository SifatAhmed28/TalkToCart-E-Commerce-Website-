import React from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaMobileAlt, FaTabletAlt, FaLaptop, FaHeadphones, FaHeadphonesAlt,
    FaVolumeUp, FaPen, FaPlug, FaBatteryFull, FaUsb
} from 'react-icons/fa';
import { MdWatch, MdChargingStation, MdCable } from 'react-icons/md';
import { BsEarbuds } from 'react-icons/bs';

const categories = [
    { name: 'Mobile Phone', icon: <FaMobileAlt size={30} /> },
    { name: 'Tablet', icon: <FaTabletAlt size={30} /> },
    { name: 'Laptop', icon: <FaLaptop size={30} /> },
    { name: 'Airpods', icon: <BsEarbuds size={30} /> },
    { name: 'Wireless Headphone', icon: <FaHeadphones size={30} /> },
    { name: 'Wired Headphone', icon: <FaHeadphonesAlt size={30} /> },
    { name: 'Headphone', icon: <FaHeadphones size={30} /> },
    { name: 'Speakers', icon: <FaVolumeUp size={30} /> },
    { name: 'Smart Watch', icon: <MdWatch size={30} /> },
    { name: 'Smart Pen', icon: <FaPen size={30} /> },
    { name: 'Power Adapter', icon: <FaPlug size={30} /> },
    { name: 'Cables', icon: <MdCable size={30} /> },
    { name: 'Power Bank', icon: <FaBatteryFull size={30} /> },
    { name: 'Hubs & Docks', icon: <FaUsb size={30} /> },
    { name: 'Wireless Charger', icon: <MdChargingStation size={30} /> },
];

const FeaturedCategories = () => {
    return (
        <Container className='my-5'>
            <h2 className='mb-4'>Featured Categories</h2>
            <Row>
                {categories.map((cat, index) => (
                    <Col key={index} xs={6} sm={4} md={3} lg={2} className='mb-3'>
                        <Link to={`/search/${cat.name}`} style={{ textDecoration: 'none' }}>
                            <Card className='text-center h-100 border-0 shadow-sm category-card'>
                                <Card.Body className='d-flex flex-column align-items-center justify-content-center'>
                                    <div className='mb-2 text-primary'>
                                        {cat.icon}
                                    </div>
                                    <Card.Text style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                        {cat.name}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default FeaturedCategories;
