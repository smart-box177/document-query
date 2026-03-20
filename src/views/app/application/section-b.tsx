import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import SectionB1 from './section-b/b1'
import SectionB2 from './section-b/b2'
import SectionB3 from './section-b/b3'
import SectionB4 from './section-b/b4'
import SectionB5 from './section-b/b5'
import SectionB6 from './section-b/b6'

interface SectionBProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const SectionB = ({ activeTab = "b1", onTabChange }: SectionBProps) => {
    return (
        <div className="flex flex-col gap-6 py-1">
            <div className="">
                <p className="text-sm text-muted-foreground">Please fill out sections B1 through B6 below.</p>
            </div>

            <Tabs 
                defaultValue="b1" 
                value={activeTab} 
                onValueChange={onTabChange}
                className="w-full relative"
            >
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-1 gap-1 h-auto bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b1">Section B1</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b2">Section B2</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b3">Section B3</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b4">Section B4</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b5">Section B5</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b6">Section B6</TabsTrigger>
                </TabsList>

                <div className="mt-4 p-5 border border-border/50 rounded-xl bg-card shadow-sm min-h-75">
                    <TabsContent value="b1" className="m-0 focus-visible:outline-none">
                        <SectionB1 />
                    </TabsContent>

                    <TabsContent value="b2" className="m-0 focus-visible:outline-none">
                        <SectionB2 />
                    </TabsContent>

                    <TabsContent value="b3" className="m-0 focus-visible:outline-none">
                        <SectionB3 />
                    </TabsContent>

                    <TabsContent value="b4" className="m-0 focus-visible:outline-none">
                        <SectionB4 />
                    </TabsContent>

                    <TabsContent value="b5" className="m-0 focus-visible:outline-none">
                        <SectionB5 />
                    </TabsContent>

                    <TabsContent value="b6" className="m-0 focus-visible:outline-none">
                        <SectionB6 />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default SectionB