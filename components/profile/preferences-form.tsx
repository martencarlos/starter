// components/profile/preferences-form.tsx
'use client';

import { useState } from 'react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// components/profile/preferences-form.tsx

// components/profile/preferences-form.tsx

interface PreferencesFormProps {
    userId: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function PreferencesForm({ userId, onSuccess, onError }: PreferencesFormProps) {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        marketingEmails: false,
        supportTicketUpdates: true,
        securityAlerts: true,
        timezone: 'Europe/Madrid', // Default to app timezone
        dateFormat: 'DD/MM/YYYY'
    });

    const handleSwitchChange = (field: string) => (checked: boolean) => {
        setPreferences({
            ...preferences,
            [field]: checked
        });
    };

    const handleSelectChange = (field: string) => (value: string) => {
        setPreferences({
            ...preferences,
            [field]: value
        });
    };

    const handleThemeChange = (value: string) => {
        setTheme(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // This endpoint doesn't exist yet and would need to be implemented
            const response = await fetch('/api/user/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    preferences
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update preferences');
            }

            onSuccess('Preferences updated successfully');
        } catch (error) {
            console.error('Error updating preferences:', error);
            onError('Failed to update preferences');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
                <h2 className='text-xl font-semibold'>User Preferences</h2>
                <p className='text-muted-foreground text-sm'>Customize your account settings and experience</p>
            </div>

            <div className='space-y-4'>
                <div>
                    <h3 className='mb-2 text-lg font-medium'>Theme</h3>
                    <RadioGroup
                        defaultValue={theme || 'system'}
                        onValueChange={handleThemeChange}
                        className='flex flex-col space-y-1'>
                        <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='light' id='theme-light' />
                            <Label htmlFor='theme-light'>Light</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='dark' id='theme-dark' />
                            <Label htmlFor='theme-dark'>Dark</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='system' id='theme-system' />
                            <Label htmlFor='theme-system'>System</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div>
                    <h3 className='mb-2 text-lg font-medium'>Email Notifications</h3>
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label htmlFor='email-notifications'>Email Notifications</Label>
                                <p className='text-muted-foreground text-sm'>
                                    Receive important account notifications via email
                                </p>
                            </div>
                            <Switch
                                id='email-notifications'
                                checked={preferences.emailNotifications}
                                onCheckedChange={handleSwitchChange('emailNotifications')}
                            />
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label htmlFor='marketing-emails'>Marketing Emails</Label>
                                <p className='text-muted-foreground text-sm'>
                                    Receive marketing and promotional emails
                                </p>
                            </div>
                            <Switch
                                id='marketing-emails'
                                checked={preferences.marketingEmails}
                                onCheckedChange={handleSwitchChange('marketingEmails')}
                            />
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label htmlFor='support-ticket-updates'>Support Ticket Updates</Label>
                                <p className='text-muted-foreground text-sm'>
                                    Receive updates about your support tickets
                                </p>
                            </div>
                            <Switch
                                id='support-ticket-updates'
                                checked={preferences.supportTicketUpdates}
                                onCheckedChange={handleSwitchChange('supportTicketUpdates')}
                            />
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label htmlFor='security-alerts'>Security Alerts</Label>
                                <p className='text-muted-foreground text-sm'>Receive alerts about security events</p>
                            </div>

                            <Switch
                                id='security-alerts'
                                checked={preferences.securityAlerts}
                                onCheckedChange={handleSwitchChange('securityAlerts')}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className='mb-2 text-lg font-medium'>Regional Settings</h3>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label htmlFor='timezone'>Timezone</Label>
                            <Select value={preferences.timezone} onValueChange={handleSelectChange('timezone')}>
                                <SelectTrigger id='timezone'>
                                    <SelectValue placeholder='Select timezone' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='Europe/Madrid'>Europe/Madrid (UTC+1/+2)</SelectItem>
                                    <SelectItem value='Europe/London'>Europe/London (UTC+0/+1)</SelectItem>
                                    <SelectItem value='America/New_York'>America/New York (UTC-5/-4)</SelectItem>
                                    <SelectItem value='America/Los_Angeles'>America/Los Angeles (UTC-8/-7)</SelectItem>
                                    <SelectItem value='Asia/Tokyo'>Asia/Tokyo (UTC+9)</SelectItem>
                                    <SelectItem value='Australia/Sydney'>Australia/Sydney (UTC+10/+11)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='date-format'>Date Format</Label>
                            <Select value={preferences.dateFormat} onValueChange={handleSelectChange('dateFormat')}>
                                <SelectTrigger id='date-format'>
                                    <SelectValue placeholder='Select date format' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='DD/MM/YYYY'>DD/MM/YYYY</SelectItem>
                                    <SelectItem value='MM/DD/YYYY'>MM/DD/YYYY</SelectItem>
                                    <SelectItem value='YYYY-MM-DD'>YYYY-MM-DD</SelectItem>
                                    <SelectItem value='DD MMM YYYY'>DD MMM YYYY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className='mb-2 text-lg font-medium'>Session Settings</h3>
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label htmlFor='extended-session'>Extended Session Length</Label>
                                <p className='text-muted-foreground text-sm'>
                                    Keep me logged in for 30 days (default is 7 days)
                                </p>
                            </div>
                            <Switch
                                id='extended-session'
                                checked={preferences.extendedSession}
                                onCheckedChange={handleSwitchChange('extendedSession')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
        </form>
    );
}
