import { compareBudget } from './currency';

export function list(s: unknown): string[] { return Array.isArray(s) ? s.map(String) : String(s || '').split(',').map(x => x.trim()).filter(Boolean); }
export function intersects(a: unknown, b: unknown) { const aa = list(a).map(x => x.toLowerCase()); return list(b).some(x => aa.includes(x.toLowerCase())); }
export function match(c: any, p: any) {
    if (!p.published)
        return null;
    const d = p.data;
    if (c.availability === 'Available' && d.availability !== 'Available')
        return null;
    if (c.aspectRatio && !list(d.aspectRatios).includes(c.aspectRatio))
        return null;
    if (c.contentType && !list(d.contentTypes).includes(c.contentType))
        return null;
    if (c.commercialUse !== 'Personal' && c.commercialUse && d.commercial !== true)
        return null;
    const budgetComparison = compareBudget(d.rate, d.currency, c.budget, c.currency);
    if (!budgetComparison.withinBudget)
        return null;
    const reasons: {
        label: string;
        points: number;
        max: number;
    }[] = [];
    const add = (label: string, yes: boolean, max: number) => reasons.push({ label, points: yes ? max : 0, max });
    add('Creative style', intersects(d.styles, c.styles), 20);
    add('Specialization', intersects(d.specializations, c.specializations), 10);
    add('Preferred tools', list(c.tools).length > 0 && intersects(d.tools, c.tools), 20);
    add('Content format', list(d.contentTypes).includes(c.contentType), 10);
    add('Aspect ratio', list(d.aspectRatios).includes(c.aspectRatio), 10);
    add('Industry experience', intersects(d.industries, c.industry), 15);
    add('Within budget', Number(d.rate) > 0 && budgetComparison.comparable && budgetComparison.withinBudget, 10);
    add('Available', d.availability === 'Available', 5);
    return { score: reasons.reduce((s, r) => s + r.points, 0), reasons };
}
export function allowedTransition(role: string, status: string, action: string, revisions: number, allowance: number) {
    if (role === 'creator' && action === 'start' && status === 'accepted')
        return 'in progress';
    if (role === 'creator' && action === 'submit' && ['in progress', 'changes requested'].includes(status))
        return status === 'changes requested' ? 'resubmitted' : 'submitted';
    if (role === 'brand' && action === 'approve' && ['submitted', 'resubmitted'].includes(status))
        return 'approved';
    if (role === 'brand' && action === 'revise' && ['submitted', 'resubmitted'].includes(status) && revisions < allowance)
        return 'changes requested';
    if (role === 'creator' && action === 'deliver' && status === 'approved')
        return 'delivered';
    if (role === 'brand' && action === 'complete' && status === 'delivered')
        return 'completed';
    return null;
}

