import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Code,
    Palette,
    Bot,
    HardDrive,
    Monitor,
    Type,
    Zap,
    Shield,
    Globe,
    FileText,
    Save,
    Download,
    Upload,
    Settings,
    Sun,
    Moon,
    Monitor as MonitorIcon
} from 'lucide-react';

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
    const [activeTab, setActiveTab] = useState('editor');
    const [selectedTheme, setSelectedTheme] = useState('system');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Settings
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-10">
                        <TabsTrigger value="editor" className="flex items-center gap-2 text-sm font-medium">
                            <Code className="h-4 w-4" />
                            Editor
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex items-center gap-2 text-sm font-medium">
                            <Palette className="h-4 w-4" />
                            Appearance
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="flex items-center gap-2 text-sm font-medium">
                            <Bot className="h-4 w-4" />
                            AI & Features
                        </TabsTrigger>
                        <TabsTrigger value="storage" className="flex items-center gap-2 text-sm font-medium">
                            <HardDrive className="h-4 w-4" />
                            Storage
                        </TabsTrigger>
                    </TabsList>

                    {/* Editor Tab */}
                    <TabsContent value="editor" className="space-y-6 mt-6 min-h-[400px]">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold flex items-center gap-1">
                                    Code Editor
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure your coding environment preferences
                                </p>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="font-size">Font Size</Label>
                                            <Select defaultValue="14">
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="12">12px</SelectItem>
                                                    <SelectItem value="14">14px</SelectItem>
                                                    <SelectItem value="16">16px</SelectItem>
                                                    <SelectItem value="18">18px</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tab-size">Tab Size</Label>
                                            <Select defaultValue="4">
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2">2 spaces</SelectItem>
                                                    <SelectItem value="4">4 spaces</SelectItem>
                                                    <SelectItem value="8">8 spaces</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="line-numbers">Line Numbers</Label>
                                                <p className="text-sm text-muted-foreground">Show line numbers in the editor</p>
                                            </div>
                                            <Switch id="line-numbers" defaultChecked />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="minimap">Minimap</Label>
                                                <p className="text-sm text-muted-foreground">Show code minimap for navigation</p>
                                            </div>
                                            <Switch id="minimap" defaultChecked />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="word-wrap">Word Wrap</Label>
                                                <p className="text-sm text-muted-foreground">Wrap long lines to fit editor width</p>
                                            </div>
                                            <Switch id="word-wrap" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="code-completion">Code Completion</Label>
                                                <p className="text-sm text-muted-foreground">Enable intelligent code suggestions</p>
                                            </div>
                                            <Switch id="code-completion" defaultChecked />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6 mt-6 min-h-[400px]">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Theme</h3>
                                <p className="text-sm text-muted-foreground">
                                    Customize the look and feel of your workspace
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold">Color Theme</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <button 
                                        onClick={() => setSelectedTheme('light')}
                                        className={`flex flex-col items-center gap-3 p-4 border rounded-lg transition-colors ${
                                            selectedTheme === 'light' 
                                                ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                                                : 'hover:bg-accent'
                                        }`}
                                    >
                                        <Sun className="h-6 w-6" />
                                        <span className="text-sm font-medium">Light</span>
                                    </button>
                                    <button 
                                        onClick={() => setSelectedTheme('dark')}
                                        className={`flex flex-col items-center gap-3 p-4 border rounded-lg transition-colors ${
                                            selectedTheme === 'dark' 
                                                ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                                                : 'hover:bg-accent'
                                        }`}
                                    >
                                        <Moon className="h-6 w-6" />
                                        <span className="text-sm font-medium">Dark</span>
                                    </button>
                                    <button 
                                        onClick={() => setSelectedTheme('system')}
                                        className={`flex flex-col items-center gap-3 p-4 border rounded-lg transition-colors ${
                                            selectedTheme === 'system' 
                                                ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                                                : 'hover:bg-accent'
                                        }`}
                                    >
                                        <MonitorIcon className="h-6 w-6" />
                                        <span className="text-sm font-medium">System</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* AI & Features Tab */}
                    <TabsContent value="ai" className="space-y-6 mt-6 min-h-[400px]">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">AI Features</h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure AI assistant and smart features
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="auto-save">Auto Save</Label>
                                        <p className="text-sm text-muted-foreground">Automatically save changes every few seconds</p>
                                    </div>
                                    <Switch id="auto-save" defaultChecked />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ai-model">AI Model</Label>
                                    <Select defaultValue="gpt-4-pro">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4-pro">GPT-4 Pro</SelectItem>
                                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                                            <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                                            <SelectItem value="claude">Claude</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code-generation-style">Code Generation Style</Label>
                                    <Select defaultValue="balanced">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="balanced">Balanced</SelectItem>
                                            <SelectItem value="creative">Creative</SelectItem>
                                            <SelectItem value="precise">Precise</SelectItem>
                                            <SelectItem value="concise">Concise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Storage Tab */}
                    <TabsContent value="storage" className="space-y-6 mt-6 min-h-[400px]">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Storage Management</h3>
                                <p className="text-sm text-muted-foreground">
                                    Manage your local storage and sync preferences
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Local Storage Used</span>
                                    <span className="text-sm">2.4 MB / 50 MB</span>
                                </div>
                                
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '4.8%' }}></div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Code Files</span>
                                        <span>1.2 MB</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Chat History</span>
                                        <span>0.8 MB</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Visual Flows</span>
                                        <span>0.4 MB</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button variant="destructive" className="w-full">
                                        Clear All Local Data
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        This will permanently delete all your local files, chat history, and settings
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}; 