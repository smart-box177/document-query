/* eslint-disable @typescript-eslint/no-explicit-any */
import { FloatingInput } from '@/components/ui/floating-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'
import type { ISectionA } from '@/interface/application'
import { useApplicationFormStore } from '@/store/application-form.store'

const SectionA = () => {
    const { formData, updateSectionA } = useApplicationFormStore()
    const [localData, setLocalData] = useState<ISectionA>(formData.sectionA!)

    const handleChange = (field: keyof ISectionA, value: any) => {
        const updatedData = { ...localData, [field]: value }
        setLocalData(updatedData)
        updateSectionA(updatedData)
    }

    return (
        <div className="flex flex-col gap-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                {/* Row 1 equivalent */}
                <div className="flex gap-4 col-span-1 md:col-span-2 space-x-2">
                    <div className="flex-1 space-y-2">
                        <Label className="text-xs text-muted-foreground ml-1">Contract Type</Label>
                        <Select
                            value={localData.contractType || ''}
                            onValueChange={(value) => handleChange('contractType', value)}
                        >
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Contract Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CALL-OUT">CALL-OUT</SelectItem>
                                <SelectItem value="NON-CALL-OUT">NON CALL-OUT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label className="text-xs text-muted-foreground ml-1">Currency</Label>
                        <Select
                            value={localData.currency || ''}
                            onValueChange={(value) => handleChange('currency', value)}
                        >
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FUSD">FUSD</SelectItem>
                                <SelectItem value="NGN">NGN</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="hidden lg:block"></div>

                {/* Grid Fields */}
                <FloatingInput
                    label="Ref. No."
                    value={localData.referenceNumber}
                    onChange={(e) => handleChange('referenceNumber', e.target.value)}
                />
                <FloatingInput
                    label="Date and Ref Inc Plan Approval"
                    value={localData.dateAndRefIncPlanApproval}
                    onChange={(e) => handleChange('dateAndRefIncPlanApproval', e.target.value)}
                />
                 <FloatingInput
                     label="Total Contract Value"
                     disabled
                     value={localData.totalContractValue}
                     onChange={(e) => handleChange('totalContractValue', e.target.value)}
                 />

                <FloatingInput
                    label="Name of Operator / Project Promoter"
                    value={localData.operatorOrProjectPromoter}
                    onChange={(e) => handleChange('operatorOrProjectPromoter', e.target.value)}
                />
                <FloatingInput
                    label="Date of and Ref (NCDMB Tech Evaluation Rpt)"
                    value={localData.dateAndRefNCDMBTechEvaluation}
                    onChange={(e) => handleChange('dateAndRefNCDMBTechEvaluation', e.target.value)}
                />
                 <FloatingInput
                     label="Total NC Value"
                     disabled
                     value={localData.totalNCValue}
                     onChange={(e) => handleChange('totalNCValue', e.target.value)}
                 />

                <FloatingInput
                    label="Contract / Project Title"
                    value={localData.contractProjectTitle}
                    onChange={(e) => handleChange('contractProjectTitle', e.target.value)}
                />
                <FloatingInput
                    label="Date of and Ref (NCDMB Comm Evaluation Rpt)"
                    value={localData.dateAndRefNCDMBCommEvaluation}
                    onChange={(e) => handleChange('dateAndRefNCDMBCommEvaluation', e.target.value)}
                />
                 <FloatingInput
                     label="1% NCDF: Being the sum of one percent of contract awarded"
                     disabled
                     value={localData.onePercentNCDF}
                     onChange={(e) => handleChange('onePercentNCDF', e.target.value)}
                 />

                <FloatingInput
                    label="Contract / Project Number"
                    value={localData.contractProjectNumber}
                    onChange={(e) => handleChange('contractProjectNumber', e.target.value)}
                />
                <FloatingInput
                    label="Date of Commencement of Contract"
                    value={localData.commencementDate}
                    onChange={(e) => handleChange('commencementDate', e.target.value)}
                />
                 <FloatingInput
                     label="NCDMB HCD Training Budget (% of TCV)"
                     disabled
                     value={localData.ncdmbHcdTrainingBudgetPercent}
                     onChange={(e) => handleChange('ncdmbHcdTrainingBudgetPercent', e.target.value)}
                 />

                <FloatingInput
                    label="Date of Commencement of Bid"
                    value={localData.bidCommencementDate}
                    onChange={(e) => handleChange('bidCommencementDate', e.target.value)}
                />
                <FloatingInput
                    label="Date of Completion of Contract"
                    value={localData.contractCompletionDate}
                    onChange={(e) => handleChange('contractCompletionDate', e.target.value)}
                />
                <FloatingInput
                    label="Main Contractor"
                    value={localData.mainContractor}
                    onChange={(e) => handleChange('mainContractor', e.target.value)}
                />

                <FloatingInput
                    label="Date and Ref (Single Source/ Selective Approval) - Not Applicable"
                    value={localData.singleSourceApprovalDateAndRef}
                    onChange={(e) => handleChange('singleSourceApprovalDateAndRef', e.target.value)}
                />
                <FloatingInput
                    label="Duration of Contract"
                    value={localData.contractDuration}
                    onChange={(e) => handleChange('contractDuration', e.target.value)}
                />

                {/* Sub-contractor */}
                <div className="flex flex-col gap-2 relative">
                    <FloatingInput
                        label="Sub-Contractor(s)"
                        value={localData.subContractors}
                        onChange={(e) => handleChange('subContractors', e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground leading-tight px-1 absolute -bottom-10 left-0 w-[200%] max-w-125">
                        In line with the statutory requirement of the NOGICD Act 2010, Tenderer shall deduct 1% NCDF for every subcontract to be issued on this contract and remit same to NCDMB. Failure to remit the said 1% NCDF shall be in non-compliance with the requirement of the NOGICD Act and be liable for sanctions.
                    </p>
                </div>

                <FloatingInput
                    label="Total NC% (Spend)"
                    className="mt-8"
                    value={localData.totalNCPercentSpend}
                    onChange={(e) => handleChange('totalNCPercentSpend', e.target.value)}
                />
                <FloatingInput
                    label="Total NC% (Manhours)"
                    className="mt-8"
                    value={localData.totalNCPercentManhours}
                    onChange={(e) => handleChange('totalNCPercentManhours', e.target.value)}
                />
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50 shadow-sm">
                    <h3 className="font-semibold text-base mb-3 border-b pb-2">DECLARATION BY OPERATOR (1-6)</h3>
                    <ol className="list-decimal list-outside ml-4 space-y-2 text-muted-foreground text-xs leading-relaxed">
                        <li>We understand that the NCCC is submitted with a view to ensuring strict compliance with the letter and spirit of the NOGICD Act, in particular the schedule thereto on the utilization of Nigerian Goods, Services and personnel as defined in the act.</li>
                        <li>We understand that the agreed Nigerian scope stated in the NCCC includes any scope not specifically included in the foreign scope or any foreign scope that the NCDMB may in future re-define as Nigerian scope.</li>
                        <li>We understand that foreign scope is limited to the items listed in the NCCC which shall be procured in compliance with extant Guidelines applicable and precedent to the procurement of such foreign scope.</li>
                        <li>We undertake that all our Contractors, Sub-contractors and Sub-vendors shall be contractually bound to this NCCC, and report Nigerian Content Information to the Operator and the Board.</li>
                        <li>We understand that NCDMB's endorsement of the NCCC does not preclude it from further exercising any of additional statutory responsibilities as may arise from new circumstances not provided for in the NCCC; nor does the endorsement discharge the operator, its contractors, sub contractors and vendors from their continuing obligation to ensure strict compliance with the provisions of the NOGICD Act.</li>
                        <li>Operator shall ensure that the process of putting in place, the award and execution of this contract in compliance with all relevant Sections of the NOGICD Act, 2010 pertaining to host community content and catchment area as well as the latest revisions of NCDMB Community Content Guidelines to the industry.</li>
                    </ol>

                    <Separator className="my-6" />

                    <div className="space-y-6">
                        <Label className="font-semibold text-sm">Signature of Operator authorised Representative (Contract Manager/Contract Holder):</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground bg-background hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="text-center">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Click to Sign digitally</p>
                                <p className="text-xs mt-1">or drag and drop a signature file</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <FloatingInput
                                label="Name"
                                className="bg-background"
                                value={localData.operatorName}
                                onChange={(e) => handleChange('operatorName', e.target.value)}
                            />
                            <FloatingInput
                                label="Designation"
                                className="bg-background"
                                value={localData.operatorDesignation}
                                onChange={(e) => handleChange('operatorDesignation', e.target.value)}
                            />
                            <FloatingInput
                                label="Date"
                                type="date"
                                className="bg-background"
                                value={localData.operatorDate}
                                onChange={(e) => handleChange('operatorDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50 shadow-sm">
                    <h3 className="font-semibold text-base mb-3 border-b pb-2">DECLARATION BY SERVICE PROVIDER (1-5)</h3>
                    <ol className="list-decimal list-outside ml-4 space-y-2 text-muted-foreground text-xs leading-relaxed">
                        <li>We understand that the NCCC is submitted with a view to ensuring strict compliance with the letter and spirit of the NOGICD Act, in particular the schedule thereto on the utilization of Nigerian Goods, Services and personnel as defined in the act.</li>
                        <li>We understand that the agreed Nigerian scope stated in the NCCC includes any scope not specifically included in the foreign scope or any foreign scope that the NCDMB may in future re-define as Nigerian scope.</li>
                        <li>We understand that foreign scope is limited to the items listed in the NCCC which shall be procured in compliance with extant Guidelines applicable and precedent to the procurement of such foreign scope.</li>
                        <li>We undertake that all our Sub-contractors and Sub-vendors shall be contractually bound to this NCCC, and report Nigerian Content Information to the Operator and the Board.</li>
                        <li>We understand that NCDMB's endorsement of the NCCC does not preclude it from further exercising any of additional statutory responsibilities as may arise from new circumstances not provided for in the NCCC; nor does the endorsement discharge the service provider, its sub contractors and vendors from their continuing obligation to ensure strict compliance with the provisions of the NOGICD Act.</li>
                    </ol>

                    <Separator className="my-6" />

                    <div className="space-y-6">
                        <p className="text-destructive text-xs italic font-medium -mt-2 mb-4">*Signing of the Declaration (on the right) by Service Provider is at the sole discretion of the Operator</p>
                        <Label className="font-semibold text-sm">Signature of Service Provider, if applicable (MD to sign):</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground bg-background hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="text-center">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Click to Sign digitally</p>
                                <p className="text-xs mt-1">or drag and drop a signature file</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <FloatingInput
                                label="Name"
                                className="bg-background"
                                value={localData.serviceProviderName || ''}
                                onChange={(e) => handleChange('serviceProviderName', e.target.value)}
                            />
                            <FloatingInput
                                label="Designation"
                                className="bg-background"
                                value={localData.serviceProviderDesignation || ''}
                                onChange={(e) => handleChange('serviceProviderDesignation', e.target.value)}
                            />
                            <FloatingInput
                                label="Date"
                                type="date"
                                className="bg-background"
                                value={localData.serviceProviderDate || ''}
                                onChange={(e) => handleChange('serviceProviderDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionA
