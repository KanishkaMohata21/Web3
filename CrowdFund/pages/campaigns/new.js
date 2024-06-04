import React, { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../Ethereum/factory';
import web3 from '../../Ethereum/web3';
import {Link,Router} from '../../routes'

const Campaign = () => {
    const [minContribution, setMinContribution] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setMinContribution(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minContribution).send({
                from: accounts[0]
            });

            Router.pushRoute('/');
        } catch (e) {
            setError(e.message);
            setMinContribution('')
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h2>Create New Campaign</h2>
            <Form onSubmit={handleSubmit} error={!!error}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        label='wei'
                        labelPosition='right'
                        value={minContribution}
                        onChange={handleInputChange}
                        style={{ width: '400px' }}
                    />
                </Form.Field>
                <Button type='submit' primary loading={loading} disabled={loading}>
                    Create
                </Button>
            </Form>
            {error && <Message error header='Oops! Something went wrong' content={error} style={{ width: '600px' }} />}
        </Layout>
    );
};

export default Campaign;
