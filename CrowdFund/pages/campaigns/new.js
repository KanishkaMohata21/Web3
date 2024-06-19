import React, { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../Ethereum/factory';
import web3 from '../../Ethereum/web3';
import { Router } from '../../routes';

const Campaign = () => {
    const [minContribution, setMinContribution] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [outcome, setOutcome] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(
                web3.utils.toWei(minContribution, 'ether'), // Convert to wei
                name,
                description,
                outcome,
                estimatedTime
            ).send({
                from: accounts[0]
            });

            Router.pushRoute('/');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h2>Create New Campaign</h2>
            <Form onSubmit={handleSubmit} error={!!error}>
                <Form.Field>
                    <label>Minimum Contribution (ETH)</label>
                    <Input
                        label='ETH'
                        labelPosition='right'
                        value={minContribution}
                        onChange={(e) => handleInputChange(e, setMinContribution)}
                        style={{ width: '400px' }}
                        type='number'
                        step='0.01' // Allow decimals
                    />
                </Form.Field>
                <Form.Field>
                    <label>Name</label>
                    <Input
                        value={name}
                        onChange={(e) => handleInputChange(e, setName)}
                        style={{ width: '400px' }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={description}
                        onChange={(e) => handleInputChange(e, setDescription)}
                        style={{ width: '400px' }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Outcome</label>
                    <Input
                        value={outcome}
                        onChange={(e) => handleInputChange(e, setOutcome)}
                        style={{ width: '400px' }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Estimated Time (days)</label>
                    <Input
                        value={estimatedTime}
                        onChange={(e) => handleInputChange(e, setEstimatedTime)}
                        style={{ width: '400px' }}
                        type='number'
                    />
                </Form.Field>
                <Button type='submit' primary loading={loading} disabled={loading}>
                    Create
                </Button>
                {error && <Message error header='Oops! Something went wrong' content={error} style={{ width: '600px', marginTop: '20px' }} />}
            </Form>
        </Layout>
    );
};

export default Campaign;
