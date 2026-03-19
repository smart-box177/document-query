import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SectionB10 from './section-b1/b1-0'

const SectionB1 = () => {
    return (
        <div className="space-y-4 m-0">
            <h3 className="text-lg font-semibold border-b pb-2">Part B1</h3>
            
            <Tabs defaultValue="b1-0" className="w-full relative">
                <TabsList className="grid w-full grid-cols-3 mb-4 gap-1 h-auto bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b1-0">B1.0</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b1-1">B1.1</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="b1-2">B1.2</TabsTrigger>
                </TabsList>

                <div className="mt-4 p-6 border border-border/50 rounded-xl bg-card shadow-sm min-h-[300px]">
                    <TabsContent value="b1-0" className="m-0 focus-visible:outline-none">
                        <SectionB10 />
                    </TabsContent>

                    <TabsContent value="b1-1" className="m-0 focus-visible:outline-none">
                        <div className="flex items-center justify-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                            <p>Content for B1.1 goes here...</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="b1-2" className="m-0 focus-visible:outline-none">
                        <div className="flex items-center justify-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                            <p>Content for B1.2 goes here...</p>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default SectionB1
