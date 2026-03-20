import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SectionC1 from './section-c/c1'
import SectionC2 from './section-c/c2'
import SectionC3 from './section-c/c3'

const SectionC = () => {
    return (
        <div className="flex flex-col gap-6 py-4">
            <div className="mb-2">
                <p className="text-sm text-muted-foreground mt-1">Please fill out sections C1 through C3 below.</p>
            </div>

            <Tabs defaultValue="c1" className="w-full relative">
                <TabsList className="grid w-full grid-cols-3 mb-4 gap-1 h-auto bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="c1">Section C1</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="c2">Section C2</TabsTrigger>
                    <TabsTrigger className="py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium" value="c3">Section C3</TabsTrigger>
                </TabsList>

                <div className="mt-4 p-6 border border-border/50 rounded-xl bg-card shadow-sm min-h-75">
                    <TabsContent value="c1" className="m-0 focus-visible:outline-none">
                        <SectionC1 />
                    </TabsContent>

                    <TabsContent value="c2" className="m-0 focus-visible:outline-none">
                        <SectionC2 />
                    </TabsContent>

                    <TabsContent value="c3" className="m-0 focus-visible:outline-none">
                        <SectionC3 />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default SectionC