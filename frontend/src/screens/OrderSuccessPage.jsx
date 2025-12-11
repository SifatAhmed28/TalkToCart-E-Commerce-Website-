import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage = () => {
    return (
        <Container className='text-center py-5'>
            <Row className='justify-content-md-center'>
                <Col md={6}>
                    <FaCheckCircle className='text-success mb-4' size={80} />
                    <h1 className='mb-3'>Payment Successful!</h1>
                    <p className='lead mb-4'>
                        Thank you for your payment. Your order has been confirmed.
                    </p>
                    <Link to='/'>
                        <Button variant='primary'>Go to Home</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderSuccessPage;
