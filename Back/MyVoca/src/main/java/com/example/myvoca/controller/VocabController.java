package com.example.myvoca.controller;

import com.example.myvoca.dto.CreateVocab;
import com.example.myvoca.dto.EditVocab;
import com.example.myvoca.dto.VocabDto;
import com.example.myvoca.service.VocabService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class VocabController{
    private final VocabService vocabService;

    @GetMapping("/api/vocabs/all")
    public List<VocabDto> getVocabByUserId(
            @Valid @RequestParam Integer user_id
    ){
        log.info("HTTP GET /api/vocabs/all?user_id="+user_id);
        return vocabService.getVocabByUserId(user_id);
    }

    @GetMapping("/api/vocabs/detail")
    public VocabDto getVocabByVocabId(
            @Valid @RequestParam Integer vocab_id
    ){
        log.info("HTTP GET /api/vocabs/detail?vocab_id="+vocab_id);
        return vocabService.getVocabDtoById(vocab_id);
    }

    @PostMapping("/api/vocabs/{user_id}")
    public CreateVocab.Response createVocab(
            @Valid @PathVariable Integer user_id,
            @Valid @RequestBody CreateVocab.Request request
    ){
        log.info("HTTP POST /api/vocabs/"+user_id);
        return vocabService.createVocab(user_id, request);
    }

    @PatchMapping("/api/vocabs/{vocab_id}")
    public VocabDto editVocab(
            @Valid @PathVariable Integer vocab_id,
            @Valid @RequestBody EditVocab.Request request
    ){
        log.info("HTTP PATCH /api/vocabs/"+vocab_id);
        return vocabService.editVocab(vocab_id, request);
    }

    @DeleteMapping("/api/vocabs/{vocab_id}")
    public VocabDto deleteVocab(
            @Valid @PathVariable Integer vocab_id
    ){
        log.info("HTTP DELETE /api/vocabs/"+vocab_id);
        return vocabService.deleteVocab(vocab_id);
    }
}