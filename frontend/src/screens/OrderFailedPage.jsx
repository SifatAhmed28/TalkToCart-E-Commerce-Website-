import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';

const OrderFailedPage = () => {
    return (
        <Container className='text-center py-5'>
            <Row className='justify-content-md-center'>
                <Col md={6}>
                    <FaTimesCircle className='text-danger mb-4' size={80} />
                    <h1 className='mb-3'>Payment Failed</h1>
                    <p className='lead mb-4'>
                        Something went wrong with your payment. Please try again.
                    </p>
                    <Link to='/cart'>
                        <Button variant='primary'>Go to Cart</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderFailedPage;
