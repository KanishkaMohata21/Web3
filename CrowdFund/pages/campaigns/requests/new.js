import React, { useState } from 'react';
import Layout from '../../../components/layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import web3 from '../../../Ethereum/web3';
import { Router, useRouter } from 'next/router';
import getCampaign from "../../../Ethereum/campaign";

export default function CreateRequest() {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e, { name, value }) => {
        if (name === 'description') setDescription(value);
        if (name === 'value') setValue(value);
        if (name === 'recipient') setRecipient(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const accounts = await web3.eth.getAccounts();
            const address = router.query.address;
            if (!address) {
                setError('Address not available in query parameters');
                setLoading(false);
                return;
            }
            const campaign = getCampaign(address);
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            });

            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (err) {
            setError(err.message);
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <h2>Create New Request</h2>
            <Form onSubmit={handleSubmit} error={!!error}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        name='description'
                        value={description}
                        onChange={handleInputChange}
                        style={{ width: '400px' }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        name='value'
                        value={value}
                        onChange={handleInputChange}
                        style={{ width: '400px' }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        name='recipient'
                        value={recipient}
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
}
